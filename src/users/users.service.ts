import { PortfolioScrap } from './scrap/portfolio.scrap';
import { UserInfo } from './../schemas/UserInfo.schema';
import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SuveyInfoDto } from './dto/suveyInfo.dto';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfo>,
    private portfolioScrap: PortfolioScrap,
  ) {}

  async insertInfo(suveyInfoDto: SuveyInfoDto, req: any): Promise<any> {
    const { _id, nickname } = req.user.user;
    const { position, front, back, design, url, portfolioUrl } = suveyInfoDto;

    const ProtfolioOgData: Array<string> =
      await this.portfolioScrap.ogdataScrap(portfolioUrl);

    await this.userModel.findOneAndUpdate(
      { _id },
      {
        $set: { suveyCheck: true },
      },
    );

    await this.userInfoModel.create({
      userId: _id,
      front,
      back,
      design,
      position,
      portfolioUrl: ProtfolioOgData,
    });

    return {
      msg: `${position} 설문조사 완료`,
      boolean: true,
    };
  }

  async deleteUser(req: any): Promise<any> {
    const { _id, position, nickname } = req.user.user;
    await this.userModel.deleteOne({ _id });
    await this.userInfoModel.deleteOne({ userId: _id });
    return {
      msg: `${nickname} 회원탈퇴 완료`,
      boolean: true,
    };
  }

  async updateUser(
    updateUserInfoDto: UpdateUserInfoDto,
    req: any,
  ): Promise<any> {
    const { _id } = req.user.user;
    const { nickname, position, front, back, design, portfolioUrl, url } =
      updateUserInfoDto;

    await this.userModel.findOneAndUpdate(
      { _id },
      {
        $set: { position, nickname },
      },
    );

    await this.userInfoModel.findOneAndUpdate(
      {
        userId: _id,
      },
      {
        $set: { front, back, design, portfolioUrl },
      },
    );
    return {
      msg: `${nickname} 회원정보 수정 완료`,
      boolean: true,
    };
  }

  async getUserInfo(req: any) {
    const { _id } = req.user.user;
    return await this.userInfoModel.findOne({ userId: _id }).populate('userId');
  }
}
