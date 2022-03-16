import { User, UserDocument } from 'src/schemas/User.schema';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AuthCredentialsDto,
  AuthSignUpDto,
  UserKakaoDto,
} from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { email, nickname, password, passwordCheck } = authCredentialsDto;

    if (password !== passwordCheck) {
      return { msg: 'IsNotEqual', boolean: false };
    }

    // 암호화
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await this.userModel.create({
        email,
        nickname,
        password: hashedPassword,
        createdAt: new Date(),
      });
      return { msg: '회원가입 성공', boolean: true };
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
    const { email, name, kakaoId } = userKakaoDto;
    await this.userModel.create({
      email,
      nickname: name,
      createdAt: new Date(),
    });
  }

  async findOne(authSignUpDto: AuthSignUpDto): Promise<any> {
    const { email } = authSignUpDto;
    return await this.userModel.findOne({ email });
  }

  async findOneByEmail(email: string): Promise<any> {
    return await this.userModel.findOne({ email });
  }
}
