import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardsModule } from './boards/boards.module';
import { logMiddleware } from './log.middleware';
import { WebRtcModule } from './web-rtc/web-rtc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@${process.env.MONGODB_KEY}:${process.env.MONGODB_PORT}`,
      {
        autoIndex: true,
        ignoreUndefined: true,
        dbName: 'db_nest',
      },
    ),
    BoardsModule,
    WebRtcModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logMiddleware).forRoutes('boards');
  }
}
