import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as csurf from 'csurf';
// import * as fs from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('./cert/rootca.key'),
  //   cert: fs.readFileSync('./cert/rootca.crt'),
  // };

  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
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
  SwaggerModule.setup('api', app, document);

  const corsOptions = {
    origin: ['https://teaming.link/', 'http://localhost:3000'],
    optionsSuccessStatus: 200,
  };

  app.use(
    helmet({
      noSniff: false,
    }),
  ); // xss 보안 설정
  app.enableCors(corsOptions); //Cors 설정
  // app.use(csurf()); //사이트 간 요청 위조 (CSRF) 설정

  app.useGlobalPipes(new ValidationPipe()); //validation 전역* 설정

  const port = process.env.PORT;
  await app.listen(port);

  Logger.log(`Application running on port ${port}`);
}
bootstrap();
