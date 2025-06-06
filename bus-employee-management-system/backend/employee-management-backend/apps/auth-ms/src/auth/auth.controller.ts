/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Imports for NestJS, DTOs, services, and utilities
import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth-ms.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { addMinutes } from 'date-fns';
import { EmailService } from '../email/email.service';
import { generateRandomPassword } from '../utils/generators';
import { JwtService } from '@nestjs/jwt';

// Initialize a single instance of PrismaClient.
const prisma = new PrismaClient(); // <-- Only need one Prisma client

@Controller('auth')
export class AuthController {
  // Inject necessary services.
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService, // Inject JwtService for JWT operations.
  ) {}

  /**
   * Handles user login.
   * Validates credentials, generates a JWT, and sets it as an HTTP-only cookie.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    // Validate the user's role, employeeID, and password.
    const user = await this.authService.validateUser(Number(loginDto.roleId), loginDto.employeeId, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { access_token } = this.authService.login(user);

    // Set the access token as an HTTP-only cookie for security.
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: true, // Always true in production (HTTPS)
      sameSite: 'none', // Required for cross-site cookies
      path: '/',
      maxAge: 3600 * 1000,
    });
    return { message: 'Login successful', token: access_token };
  }

  /**
   * Handles jwt verfication.
  */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Req() req: Request, @Res() res: Response) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1]; // Extract the token from the header.

    try { 
      const payload = this.jwtService.verify(token); // Verify the token using JwtService.
      return res.status(200).json({ valid: true, user:payload }); // Return the payload if valid.
    } catch (error) {
      return res.status(401).json({ valid: false, message: 'Invalid token' }); // Return error if token is invalid.
    }
  }
  
  /**
   * Handles new user registration.
   * Checks for existing users, hashes the password, stores the new user, and sends a welcome email.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: {
    employeeId: string;
    roleId: number;
    email: string,
    birthdate: Date,
    firstName: string,
    lastName: string,
    phone?: string,
    streetAddress?: string,
    city?: string,
    province?: string,
    zipCode?: string,
    country?: string,
    securityQuestionId: number,
    securityAnswer: string;
  }) {
    const { employeeId, roleId, email, birthdate, firstName, lastName, phone, streetAddress, city, province, zipCode, country, securityQuestionId, securityAnswer } = body;

    // Check if a user with the given employeeId already exists.
    const existing = await prisma.user.findUnique({ where: { employeeId } });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const tempPassword = generateRandomPassword(); // Generate a temporary random password.
    const passwordhash = await argon2.hash(tempPassword, { type: argon2.argon2id }); // Hash the password.
    const securityAns = body.securityAnswer ?? '';
    const AnswerHash = await argon2.hash(securityAns, { type: argon2.argon2id }); // Hash the security answer.

    const user = await prisma.user.create({
      data: { employeeId, roleId, password: passwordhash, email, birthdate, firstName, lastName, phone, streetAddress, city, province, zipCode, country, securityQuestionId, securityAnswer: AnswerHash },
    });

    await this.emailService.sendWelcomeEmail(user.email, user.employeeId, tempPassword, firstName); // Send welcome email with temporary password.

    return {
      message: 'User registered successfully', user: {
        id: user.id,
        employeeID: user.employeeId,
        role: user.roleId,
        email: user.email,
        birthdate: user.birthdate,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        streetAddress: user.streetAddress,
        city: user.city,
        province: user.province,
        zipCode: user.zipCode,
        country: user.country,
        securityQuestion: user.securityQuestionId,
        securityAnswerHash: user.securityAnswer, // Note: This returns the hash
        message: 'User Registered. Email Sent'
      }
    };
  }

  /**
   * Handles requests to initiate a password reset.
   * Generates a reset token and expiry, stores them for the user, and emails the token.
   */
  @Post('request-security-question')
  @HttpCode(HttpStatus.OK)
  async requestReset(@Body() body: { email: string }) {
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      throw new BadRequestException('No such user');
    }

    const question = await prisma.securityQuestion.findUnique({
      where: { id: user.securityQuestionId },
    });
    if (!question) throw new BadRequestException('Security question not found');
    return {securityQuestion: question.question}; // Return the security question for the user to answer.
  }

  @Post('validate-security-answer')
  @HttpCode(HttpStatus.OK)
  async validateSecurityAnswer(@Body() body: { email: string; answer: string }) {
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      throw new BadRequestException('Invalid Request');
    }

    if (!user.securityAnswer) {
      throw new BadRequestException('Security answer not set for this user');
    }

    const isCorrect = await argon2.verify(user.securityAnswer, body.answer); // Verify the security answer against the stored hash.
    if (!isCorrect) throw new UnauthorizedException('Incorrect security answer');

    const token = crypto.randomBytes(32).toString('hex'); // Generate a secure random token.
    const expiry = addMinutes(new Date(), 15); // Token expiry set to 15 minutes.

    // Update user with reset token and expiry.
    await prisma.user.update({
      where: { email: body.email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    await this.emailService.sendResetEmail(user.email, token); // Send reset email.
    return { message: 'If your answer is correct, a reset link was sent to your email.' }; // Token returned here for potential alternative delivery/logging.
  }

  /**
   * Handles the actual password reset using a token.
   * Verifies the token, checks its expiry, and updates the user's password.
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    // Find user by non-expired reset token.
    const user = await prisma.user.findFirst({
      where: {
        resetToken: body.token,
        resetTokenExpiry: {
          gt: new Date() // 'gt' means "greater than", ensuring the token is not expired.
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hash = await argon2.hash(body.newPassword, { type: argon2.argon2id }); // Hash the new password.

    // Update password and clear reset token fields.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hash,
        resetToken: null, // Important: Clear the token to prevent reuse.
        resetTokenExpiry: null, // Important: Clear token expiry.
      },
    });

    return { message: 'Password reset successfully' };
  }

  /**
   * Handles the first password reset for a new user if `mustChangePassword` is true.
   * Updates the password and sets `mustChangePassword` to false.
   */
  @Post('first-password-reset')
  @HttpCode(HttpStatus.OK)
  async firstPasswordReset(@Body() body: { employeeId: string; newPassword: string }) {
    const user = await prisma.user.findUnique({
      where: { employeeId: body.employeeId },
    });
    if (!user) {
      throw new BadRequestException('No such user');
    }

    if (!user.mustChangePassword) { // Check if a password change is actually required.
      throw new BadRequestException('Password reset not required or already completed');
    }

    const hash = await argon2.hash(body.newPassword, { type: argon2.argon2id });
    await prisma.user.update({
      where: { employeeId: body.employeeId },
      data: {
        password: hash,
        mustChangePassword: false, // Mark that the initial password reset is done.
      },
    });

    return { message: 'Password reset successfully' };
  }

  /**
   * Handles user logout.
   * Clears the JWT cookie.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    // Clear the 'jwt' cookie to log the user out.
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged out successfully' };
  }
}
