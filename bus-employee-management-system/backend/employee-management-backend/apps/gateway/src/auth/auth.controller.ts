/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res, Headers, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,) {}

  @Post('login')
  async login(@Body() credentials: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(credentials);

    // Check if response and headers exist before accessing set-cookie
    if (response && response.headers && response.headers['set-cookie']) {
      res.setHeader('Set-Cookie', response.headers['set-cookie']);
    }

    // Forward status and data
    res.status(response.status).json(response.data);
  }


  @Post('first-password-reset')
  async firstResetPassword(@Body() body: { employeeId: string; newPassword: string }) {
    const { employeeId, newPassword } = body;
    if (!employeeId || !newPassword) {
      throw new Error('Employee ID and new password are required');
    }
    return this.authService.firstResetPassword(employeeId, newPassword);
  }

  @Post('verify')
  async verify(@Headers('authorization') authHeader: string) {
    // authHeader looks like "Bearer <token>"
    if (!authHeader) {
      throw new BadRequestException('Missing Authorization header');
    }
    const token = authHeader.split(' ')[1]; // Get the token part

    if (!token) {
      throw new BadRequestException('No token provided');
    }

    return this.authService.verify(token);
  }

  @Post('request-security-question')
  async requestSecurityQuestion(@Body('email') email: string) {
    return this.authService.requestSecurityQuestion(email);
  }
  
  @Post('validate-security-answer')
  async validateSecurityAnswer(@Body() body: { email: string; answer: string }) {
    return this.authService.validateSecurityAnswer(body.email, body.answer);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;
    if (!token || !newPassword) {
      throw new Error('Token and new password are required');
    }
    return this.authService.resetPassword(token, newPassword);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // Just clear the cookie right here!
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      // Do NOT set domain unless you set it when creating the cookie
    });
    res.status(200).json({ message: 'Logged out' });
  }
}
