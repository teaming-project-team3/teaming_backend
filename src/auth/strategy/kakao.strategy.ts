import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { UsersRepository } from '../users.repository';
import * as dotenv from 'dotenv';
import { AuthService } from '../auth.service';
dotenv.config();

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.KAKAO_KEY,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: any,
    refreshToken: any,
    profile: any,
    done: any,
  ): Promise<any> {
    const profileJson = profile._json;
    const kakao_account = profileJson.kakao_account;
    const payload = {
      name: kakao_account.profile.nickname,
      kakaoId: profileJson.id,
      email:
        kakao_account.has_email && !kakao_account.email_needs_agreement
          ? kakao_account.email
          : null,
      accessToken,
    };
    done(null, payload);
  }
}
