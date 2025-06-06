/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; // Import AuthModule
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import { RolesController } from './auth/roles.controller';





@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig],
      envFilePath: 'apps/gateway/.env', // (relative to process.cwd())
    }),
    HttpModule,
    AuthModule,
    ClientsModule.register([
      {
        
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4003,
        },
      },
    ]),
  ],
  controllers: [AppController, RolesController], // Register AuthController
  providers: [AppService], // Register AuthService
})
export class AppModule {}