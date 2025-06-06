/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getRoles() {
    try {
      const authServiceUrl = this.configService.get<string>(
        'auth.authServiceUrl',
      );
      const response = await firstValueFrom(
        this.httpService.get(`${authServiceUrl}/roles`),
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw new Error('Failed to fetch roles');
    }
  }
}
// This code defines a RolesController that fetches roles from an external service using HttpService.
// It uses the firstValueFrom operator to convert the observable returned by HttpService into a promise.
