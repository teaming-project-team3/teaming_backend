import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('./cert/rootca.key'),
  //   cert: fs.readFileSync('./cert/rootca.crt'),
  // };

  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Teaming API DOCS')
    .setDescription('API 문서입니다.')
    .setVersion('2.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.enableCors(); //Cors 설정
  app.useGlobalPipes(new ValidationPipe()); //validation 전역* 설정

  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT;
  await app.listen(port);
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
