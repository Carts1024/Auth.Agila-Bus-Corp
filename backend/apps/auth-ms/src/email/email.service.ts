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
        const baseUrl = process.env.ALLOWED_ORIGINS;
        const resetLink = `${baseUrl}/authentication/new-password?token=${token}`;

        await this.transporter.sendMail({
            from: `"Agila Bus Transport Corporation" <${process.env.STMP_USER}>`, // sender address
            to, 
            subject: 'Reset your Agila Bus Transport Corporation Password', // Subject line
            html: `<p>Click the link below to reset your password. This will expire soon:</p>
                   <a href="${resetLink}">${resetLink}</a>`,
        });
    }

    async sendWelcomeEmail(to: string, employeeId: string, password: string, firstName: string) {
        await this.transporter.sendMail({
            from: `"Agila Bus Transport Corporation" <${process.env.STMP_USER}>`, // sender address
            to, 
            subject: 'Welcome to Agila Bus Transport Corporation', // Subject line
            html: `<p>Welcome to Agila Bus Transport Corporation <strong>${firstName}</strong>!</p>
                   <p>Your Employee ID is: <strong>${employeeId}</strong></p>
                   <p>Your temporary password is: <strong>${password}</strong></p>
                   <p>Please change your password after logging in.</p>`,
        }); 
    }
}