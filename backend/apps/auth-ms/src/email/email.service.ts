/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        // Create a transporter object using the default SMTP transport
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.STMP_USER,
                pass: process.env.STMP_PASS,
            },
        });
    }
    
    async sendResetEmail(to: string, token: string){
        const baseUrl = process.env.EMAIL_ORIGIN;
        const resetLink = `${baseUrl}/authentication/new-password?token=${token}`;

        await this.transporter.sendMail({
            from: `"Agila Bus Transport Corporation" <${process.env.STMP_USER}>`, // sender address
            to, 
            subject: 'Reset your Agila Bus Transport Corporation Password', // Subject line
            html: `<p>Click the link below to reset your password. This will expire soon:</p>
                   <a href="${resetLink}">${resetLink}</a>`,
        });
    }

    async sendWelcomeEmail(to: string, employeeNumber: string, password: string, firstName: string) {
        await this.transporter.sendMail({
            from: `"Agila Bus Transport Corporation" <${process.env.STMP_USER}>`, // sender address
            to, 
            subject: 'Welcome to Agila Bus Transport Corporation', // Subject line
            html: `<p>Welcome to Agila Bus Transport Corporation <strong>${firstName}</strong>!</p>
                   <p>Your Employee ID is: <strong>${employeeNumber}</strong></p>
                   <p>Your temporary password is: <strong>${password}</strong></p>
                   <p>Please change your password after logging in.</p>`,
        }); 
    }

    async sendSecurityQuestionEmail(to: string, token: string) {
        const baseUrl = process.env.EMAIL_ORIGIN;
        const securityQuestionLink = `${baseUrl}/authentication/security-questions?token=${token}`;

        await this.transporter.sendMail({
            from: `"Agila Bus Transport Corporation" <${process.env.STMP_USER}>`, // sender address
            to, 
            subject: 'Reset your Agila Bus Transport Corporation Password', // Subject line
            html: `<p>You have requested to reset your password for your Agila Bus Transport Corporation account.</p>
                   <p>To proceed with the password reset, please click the link below to answer your security question:</p>
                   <a href="${securityQuestionLink}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">Reset My Password</a>
                   <p>Or copy and paste this link into your browser:</p>
                   <p><a href="${securityQuestionLink}">${securityQuestionLink}</a></p>
                   <p>This link will expire in 15 minutes for security purposes.</p>
                   <p>If you did not request this password reset, please ignore this email.</p>
                   <br>
                   <p>Best regards,<br>Agila Bus Transport Corporation</p>`,
        });
    }
}