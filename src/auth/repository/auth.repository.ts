import { User } from '../../schemas/User.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserKakaoDto } from '../dto/auth-userkakao.dto';
import { AuthCredentialsDto } from '../dto/auth-credential.dto';
import { UserInfo } from 'src/schemas/UserInfo.schema';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfo>,
  ) {}

  async createTeamingUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<object> {
    const { email, nickname, password, profileUrl } = authCredentialsDto;

    const user = await this.userModel.create({
      email,
      nickname,
      password,
      profileUrl,
    });
    return user;
  }

  async createKakao(userKakaoDto: UserKakaoDto) {
    const { kakaoId, name, email, profileUrl } = userKakaoDto;
    const checkEmail = !email ? String(kakaoId) : email;
    return await this.userModel.create({
      email: checkEmail,
      nickname: name,
      profileUrl,
      kakaoId,
    });
  }

  async findOneByEmail(email: string): Promise<object> {
    return await this.userModel.findOne({ email });
  }

  async findOneById(_id: string): Promise<object> {
    return await this.userModel.findOne({ _id });
  }

  async findOneByName(name: string): Promise<object> {
    return await this.userModel.findOne({ nickname: name });
  }

  async find(): Promise<any> {
    return await this.userModel.find().exec();
  }

  async createUserInfo(userId: string): Promise<void> {
    await this.userInfoModel.create({
      userId,
      portfolioUrl: [],
    });
  }
}
