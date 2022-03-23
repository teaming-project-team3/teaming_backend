import { User } from '../../schemas/User.schema';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AuthSignInDto } from '../dto/auth-signin.dto';
import { UserKakaoDto } from '../dto/auth-userkakao.dto';
import { AuthCredentialsDto } from '../dto/auth-credential.dto copy';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { email, nickname, password, passwordCheck, profileUrl } =
      authCredentialsDto;

    const specialRule = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    if (specialRule.test(nickname)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: '닉네임에 특수문자를 사용할 수 없습니다.',
        },
        400,
      );
    }

    if (password !== passwordCheck) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'IsNotEqual',
        },
        400,
      );
    }

    // 암호화
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await this.userModel.create({
        email,
        nickname,
        password: hashedPassword,
        profileUrl,
      });
      return user;
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

  async findOneById(_id: string): Promise<any> {
    return await this.userModel.findOne({ _id });
  }

  async findOneByName(name: string): Promise<any> {
    return await this.userModel.findOne({ nickname: name });
  }

  async find(): Promise<any> {
    return await this.userModel.find().exec();
  }
}
