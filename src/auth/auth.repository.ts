import { User } from '../schemas/User.schema';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AuthCredentialsDto,
  AuthSignInDto,
  UserKakaoDto,
} from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { email, nickname, password, passwordCheck } = authCredentialsDto;

    if (password !== passwordCheck) {
      return { msg: 'IsNotEqual', success: false };
    }

    // 암호화
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await this.userModel.create({
        email,
        nickname,
        password: hashedPassword,
      });
      return { msg: '회원가입 성공', success: true };
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new ConflictException(`Exisiting ${Object.keys(error.keyValue)}`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async createKakao(userKakaoDto: UserKakaoDto) {
    const { kakaoId, name, email, provider, profileUrl } = userKakaoDto;
    return await this.userModel.create({
      email,
      nickname: name,
      profileUrl,
      kakaoId,
    });
  }

  async findOne(authSignInDto: AuthSignInDto): Promise<any> {
    const { email } = authSignInDto;
    return await this.userModel.findOne({ email });
  }

  // async findOneByEmail(email: string): Promise<any> {
  //   return await this.userModel.findOne({ email });
  // }

  // async findOneByNickname(nickname: string): Promise<any> {
  //   return await this.userModel.findOne({ nickname });
  // }

  async findOneById(_id): Promise<any> {
    return await this.userModel.findOne({ _id });
  }

  async find(): Promise<any> {
    return await this.userModel.find().exec();
  }
}
