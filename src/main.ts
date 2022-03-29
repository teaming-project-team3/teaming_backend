import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('./cert/rootca.key'),
  //   cert: fs.readFileSync('./cert/rootca.crt'),
  // };

  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
    cors: true,
  });
  app.enableCors(); //Cors 설정
  app.useGlobalPipes(new ValidationPipe()); //validation 전역* 설정
  const port = process.env.PORT;
  await app.listen(port);
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
