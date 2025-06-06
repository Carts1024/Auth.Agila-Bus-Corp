/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { AuthMsModule } from './auth-ms.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthMsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 4003,
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port);
}
bootstrap().catch(err => {
  console.error('Microservice failed to start:', err);
  process.exit(1);
});
