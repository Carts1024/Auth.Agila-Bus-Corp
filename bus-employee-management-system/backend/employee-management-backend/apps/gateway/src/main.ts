/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get<string[]>('app.allowedOrigins') || [];
  // const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = configService.get<number>('app.port') || 3002;
  await app.listen(port);
}
// Handle the Promise explicitly:
bootstrap().catch(err => {
  console.error('Failed to start the app:', err);
  process.exit(1);
});