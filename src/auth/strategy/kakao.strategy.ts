import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
// import * as dotenv from 'dotenv';
// dotenv.config();

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_KEY,
      callbackURL:
        'http://reactproject2.s3-website.ap-northeast-2.amazonaws.com/auth/kakao/redirect',
    });
  }

  async validate(
    accessToken: any,
    refreshToken: any,
    profile: any,
    done: any,
  ): Promise<any> {
    console.log('accessToken : ', accessToken);
    console.log('=============================');
    console.log('refreshToken : ', refreshToken);
    console.log('=============================');
    console.log('profile : ', profile);
    console.log('=============================');
    console.log('done : ', done);

    const profileJson = profile._json;
    const kakao_account = profileJson.kakao_account;
    const provider = profile.provider;
    const payload = {
      name: kakao_account.profile.nickname,
      kakaoId: profileJson.id,
      email:
        kakao_account.has_email && !kakao_account.email_needs_agreement
          ? kakao_account.email
          : null,
      kakaoAccessToken: accessToken,
      provider,
      profileUrl: profileJson.properties.profile_image,
    };
    console.log(
      'profileJson.properties.profile_image ' +
        profileJson.properties.profile_image,
    );
    done(null, payload);
  }
}
