import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardsModule } from './boards/boards.module';
import { logMiddleware } from './log.middleware';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ChatsModule } from './chats/chats.module';
import { UsersModule } from './users/users.module';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      // `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@${process.env.MONGODB_KEY}:${process.env.MONGODB_PORT}`,
      `mongodb://localhost`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ignoreUndefined: true,
        dbName: 'db_nest',
      },
    ),
    BoardsModule,
    AuthModule,
    ChatsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logMiddleware).forRoutes('boards');
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.isDev);
  }
}
