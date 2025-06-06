/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

async pingAuth(): Promise<string> {
  const response = await firstValueFrom(this.authClient.send<string>('auth:ping', {}));
  return response;
}
}
