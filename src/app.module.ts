import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@${process.env.MONGODB_KEY}:${process.env.MONGODB_PORT}`,
      {
        autoIndex: true,
        ignoreUndefined: true,
        dbName: 'db_nest',
      },
    ),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
