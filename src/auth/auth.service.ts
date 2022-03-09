import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { Model } from 'mongoose';
import { User } from './auth.model';
@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async signUp(authcredentialsDto: AuthCredentialsDto): Promise<any> {
    const { password, passwordCheck } = authcredentialsDto;
    if (password !== passwordCheck) {
      return { msg: 'IsNotEqual', boolean: false };
    }

    const existUsers = await this.userModel.findOne({});
    await this.userModel.create({
      ...authcredentialsDto,
      createdAt: new Date(),
    });
    return { msg: '회원가입 성공', boolean: true };
  }
}
