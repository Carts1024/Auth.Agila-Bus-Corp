/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Imports for NestJS, DTOs, services, and utilities
import { Controller, Post, Get, Body, HttpCode, HttpStatus, Req, Res, UnauthorizedException, BadRequestException } from '@nestjs/common';
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
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// Initialize a single instance of PrismaClient.
const prisma = new PrismaClient(); // <-- Only need one Prisma client

@Controller('auth')
export class AuthController {
  private HR_SERVICE_URL = process.env.HR_SERVICE_URL || 'http://localhost:4002';
  // Inject necessary services.
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService, // Inject JwtService for JWT operations.
    private readonly httpService: HttpService,
    
  ) {}

  /**
   * Handles user login.
   * Validates credentials, generates a JWT, and   sets it as an HTTP-only cookie.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {

    // Step 1: Get employee by employeeNumber from HR Service
    let employee;
    console.log('Login attempt for employee number:', loginDto.employeeNumber);
    try {
      const hrRes = await firstValueFrom(
        this.httpService.get(`${this.HR_SERVICE_URL}/employees/by-number/${loginDto.employeeNumber}`)
      );
      employee = hrRes.data;
    } catch (err) {
      throw new UnauthorizedException('Invalid employee number or password');
    }

    // if (!employee?.id) {
    //   throw new UnauthorizedException('Invalid employee number or password no');
    // }

    // Step 2: Validate the user by employeeId and password
    // Use employee.id, not employee.number!

    const user = await this.authService.validateUser(employee.id, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user must change password (new user flow)
    if (user.mustChangePassword) {
      // Check if security question is already set up
      if (!user.securityQuestionId || !user.securityAnswer) {
        return {
          message: 'Security question setup required',
          requiresSecuritySetup: true,
          employeeNumber: loginDto.employeeNumber,
          nextStep: 'security-question-setup'
        };
      } else {
        return {
          message: 'Password reset required',
          requiresPasswordReset: true,
          employeeNumber: loginDto.employeeNumber,
          nextStep: 'mandatory-password-reset'
        };
      }
    }

    const role = await this.authService.getRole(user);
    if (!role) {
      throw new BadRequestException('Role not found for user');
    }
    const { access_token } = this.authService.login(user);

    // Set the access token as an HTTP-only cookie for security.
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: true, // Always true in production (HTTPS)
      sameSite: 'lax',
      path: '/',
      domain: process.env.COOKIE_DOMAIN, // Set the domain for the cookie
      maxAge: 3600 * 1000,
    });
    return { message: 'Login successful', token: access_token, role: role.name };
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
  // @Post('register')
  // @HttpCode(HttpStatus.CREATED)
  // async register(@Body() body: {
  //   employeeId: string;
  //   roleId: number;
  //   email: string,
  //   birthdate: Date,
  //   firstName: string,
  //   lastName: string,
  //   phone?: string,
  //   streetAddress?: string,
  //   city?: string,
  //   province?: string,
  //   zipCode?: string,
  //   country?: string,
  //   securityQuestionId: number,
  //   securityAnswer: string;
  // }) {
  //   const { employeeId, roleId, email, birthdate, firstName, lastName, phone, streetAddress, city, province, zipCode, country, securityQuestionId, securityAnswer } = body;

  //   // Check if a user with the given employeeId already exists.
  //   const existing = await prisma.user.findUnique({ where: { employeeId } });
  //   if (existing) {
  //     throw new BadRequestException('User already exists');
  //   }

  //   const tempPassword = generateRandomPassword(); // Generate a temporary random password.
  //   const passwordhash = await argon2.hash(tempPassword, { type: argon2.argon2id }); // Hash the password.
  //   const securityAns = body.securityAnswer ?? '';
  //   const AnswerHash = await argon2.hash(securityAns, { type: argon2.argon2id }); // Hash the security answer.

  //   const user = await prisma.user.create({
  //     data: { employeeId, roleId, password: passwordhash, email, securityQuestionId, securityAnswer: AnswerHash },
  //   });

  //   await this.emailService.sendWelcomeEmail(user.email, user.employeeId, tempPassword, firstName); // Send welcome email with temporary password.

  //   return {
  //     message: 'User registered successfully', user: {
  //       id: user.id,
  //       employeeID: user.employeeId,
  //       role: user.roleId,
  //       email: user.email,
  //       securityQuestion: user.securityQuestionId,
  //       securityAnswerHash: user.securityAnswer, // Note: This returns the hash
  //       message: 'User Registered. Email Sent'
  //     }
  //   };
  // }


@Post('register')
@HttpCode(HttpStatus.CREATED)
async register(@Body() body: {
  employeeId: string,            // Employee PK (cuid)
  roleId: number,
  email: string,
  firstName: string, // For welcome email
  employeeNumber?: string // Optionally accept this, else fetch
}) {
  const { employeeId, roleId, email, firstName, employeeNumber: empNoFromReq } = body;

  // 1. Check for existing user with this employeeId or email
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { employeeId },
        { email }
      ]
    }
  });
  if (existingUser) {
    throw new BadRequestException('User already exists for this employee or email');
  }

  // 2. Generate and hash temporary password
  const tempPassword = generateRandomPassword();
  const passwordHash = await argon2.hash(tempPassword, { type: argon2.argon2id });
  // const securityAnswerHash = await argon2.hash(securityAnswer ?? '', { type: argon2.argon2id });

  // 3. Create user record
  const user = await prisma.user.create({
    data: {
      employeeId,
      roleId,
      email,
      password: passwordHash,
      mustChangePassword: true,
      // securityQuestionId,
      // securityAnswer: securityAnswerHash,
      status: "active",
    }
  });

  // 4. Fetch employee info from HR service, including position and department
  let employeeNumber = empNoFromReq || '';
  let positionId: number | null = null;
  let departmentName = '';
  try {
    const url = `${process.env.HR_SERVICE_URL}/employees/${employeeId}`;
    const hrRes = await firstValueFrom(this.httpService.get(url));
    const emp = hrRes.data;

    // Now emp should include .position and .position.department!
    employeeNumber = emp?.employeeNumber || '[Unknown]';
    positionId = emp?.position?.id || null;
    departmentName = emp?.position?.department?.departmentName || '';
  } catch (e) {
    console.error('Error fetching employee info:', e);
    employeeNumber = '[Unknown]';
  }

  // 5. Send welcome email
  await this.emailService.sendWelcomeEmail(email, employeeNumber, tempPassword, firstName /*, departmentName */);

  return {
    message: 'User registered successfully',
    user: {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      roleId: user.roleId,
      mustChangePassword: user.mustChangePassword,
      status: user.status,
      employeeNumber,
      positionId,
      departmentName,
    }
  };
}

  /**
   * Sets up security question and answer for a user who must change their password.
   * This is part of the mandatory setup flow for new users.
   */
  @Post('setup-security-question')
  @HttpCode(HttpStatus.OK)
  async setupSecurityQuestion(@Body() body: { 
    employeeNumber: string; 
    securityQuestionId: number; 
    securityAnswer: string 
  }) {
    const { employeeNumber, securityQuestionId, securityAnswer } = body;

    // 1. Lookup the employee by number (HR Service)
    let employeeId: string | undefined;
    try {
      const hrRes = await firstValueFrom(
        this.httpService.get(`${process.env.HR_SERVICE_URL}/employees/by-number/${employeeNumber}`)
      );
      employeeId = hrRes.data.id;
    } catch {
      throw new BadRequestException('Invalid employee number');
    }

    if (!employeeId) {
      throw new BadRequestException('Employee not found');
    }

    // 2. Find the user in Auth DB
    const user = await prisma.user.findUnique({
      where: { employeeId },
    });
    if (!user) {
      throw new BadRequestException('No such user');
    }

    if (!user.mustChangePassword) {
      throw new BadRequestException('Security question setup not required');
    }

    // 3. Verify the security question exists
    const securityQuestion = await prisma.securityQuestion.findUnique({
      where: { id: securityQuestionId },
    });
    if (!securityQuestion) {
      throw new BadRequestException('Invalid security question');
    }

    // 4. Hash the security answer and update user
    const securityAnswerHash = await argon2.hash(securityAnswer, { type: argon2.argon2id });
    
    await prisma.user.update({
      where: { employeeId },
      data: {
        securityQuestionId,
        securityAnswer: securityAnswerHash,
      },
    });

    return { 
      message: 'Security question setup completed successfully',
      nextStep: 'password-reset' // Indicates the next required step
    };
  }

  /**
   * Handles the mandatory password reset for new users after security question setup.
   * Updates the password and sets `mustChangePassword` to false.
   */
  @Post('mandatory-password-reset')
  @HttpCode(HttpStatus.OK)
  async mandatoryPasswordReset(@Body() body: { 
    employeeNumber: string; 
    newPassword: string 
  }) {
    const { employeeNumber, newPassword } = body;

    // 1. Lookup the employee by number (HR Service)
    let employeeId: string | undefined;
    try {
      const hrRes = await firstValueFrom(
        this.httpService.get(`${process.env.HR_SERVICE_URL}/employees/by-number/${employeeNumber}`)
      );
      employeeId = hrRes.data.id;
    } catch {
      throw new BadRequestException('Invalid employee number');
    }

    if (!employeeId) {
      throw new BadRequestException('Employee not found');
    }

    // 2. Find the user in Auth DB
    const user = await prisma.user.findUnique({
      where: { employeeId },
    });
    if (!user) {
      throw new BadRequestException('No such user');
    }

    if (!user.mustChangePassword) {
      throw new BadRequestException('Password reset not required or already completed');
    }

    // 3. Verify security question is set up
    if (!user.securityQuestionId || !user.securityAnswer) {
      throw new BadRequestException('Security question must be set up first');
    }

    // 4. Hash and update password
    const hash = await argon2.hash(newPassword, { type: argon2.argon2id });
    await prisma.user.update({
      where: { employeeId },
      data: {
        password: hash,
        mustChangePassword: false,
      },
    });

    return { 
      message: 'Password reset successfully. You can now login with your new credentials.',
      redirectTo: 'login' // Indicates where the frontend should redirect
    };
  }

  /**
   * Fetches all available security questions.
   * This endpoint allows users to select from available security questions.
   */
  @Get('security-questions')
  @HttpCode(HttpStatus.OK)
  async getSecurityQuestions() {
    const questions = await prisma.securityQuestion.findMany({
      select: {
        id: true,
        question: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return { securityQuestions: questions };
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
      where: { id: user.securityQuestionId ?? undefined },
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
  async firstPasswordReset(
    @Body() body: { employeeNumber: string; newPassword: string }
  ) {
    // 1. Lookup the employee by number (HR Service)
    let employeeId: string | undefined;
    try {
      const hrRes = await firstValueFrom(
        this.httpService.get(`${process.env.HR_SERVICE_URL}/employees/by-number/${body.employeeNumber}`)
      );
      employeeId = hrRes.data.id;
    } catch {
      throw new BadRequestException('Invalid employee number');
    }

    if (!employeeId) {
      throw new BadRequestException('Employee not found');
    }

    // 2. Find the user in Auth DB
    const user = await prisma.user.findUnique({
      where: { employeeId },
    });
    if (!user) {
      throw new BadRequestException('No such user');
    }

    if (!user.mustChangePassword) {
      throw new BadRequestException('Password reset not required or already completed');
    }

    // 3. Hash and update password
    const hash = await argon2.hash(body.newPassword, { type: argon2.argon2id });
    await prisma.user.update({
      where: { employeeId },
      data: {
        password: hash,
        mustChangePassword: false,
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

  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' }
      // No select = all fields will be returned
    });
    return { users };
  }
}
