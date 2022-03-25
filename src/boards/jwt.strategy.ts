import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from 'src/schemas/User.schema';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      secretOrKey: process.env.JWT_SCERTKEY,
      ignoreExpiration: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    // console.log('payload: ', payload);
    const { nickname } = payload;
    const user: User = await this.userModel.findOne(
      { nickname: nickname },
      { password: 0 },
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
