import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //Cors 설정
  // app.useGlobalPipes(new ValidationPipe()); //validation 전역* 설정
  const port = process.env.PORT;
  await app.listen(port);
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
