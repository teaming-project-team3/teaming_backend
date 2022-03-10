import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { User, UserSchema } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import * as dotenv from 'dotenv';
import { HttpModule } from '@nestjs/axios';
import { KakaoStrategy } from './strategy/kakao.strategy';
dotenv.config();
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SCERTKEY,
      signOptions: {
        expiresIn: 60 * 60, //유효 시간
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule,
  ],
  controllers: [AuthController],

  // proviers에는 해당 모듈에서 사용하기 위한 것들을 등록
  providers: [AuthService, UsersRepository, JwtStrategy, KakaoStrategy],
  // 해당 모듈을 제외한 외부에서 사용하고 싶다면 exports에 등록
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
