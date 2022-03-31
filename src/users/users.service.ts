import { PortfolioScrap } from './scrap/portfolio.scrap';
import { UserInfo } from './../schemas/UserInfo.schema';
import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SuveyInfoDto } from './dto/suveyInfo.dto';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import { Board } from 'src/schemas/Board.schema';
import { Project } from 'src/schemas/Project.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfo>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private portfolioScrap: PortfolioScrap,
  ) {}

  async insertInfo(suveyInfoDto: SuveyInfoDto, req: any): Promise<any> {
    const { _id, nickname } = req.user.user;
    const { position, front, back, design, url, portfolioUrl } = suveyInfoDto;
    let protfolioOgData: string[];
    if (portfolioUrl) {
      protfolioOgData = await this.portfolioScrap.ogdataScrap(portfolioUrl);
    }

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
      portfolioUrl: protfolioOgData,
      url,
    });

    return {
      msg: `${position} 설문조사 완료`,
    };
  }

  async deleteUser(req: any): Promise<any> {
    const { _id, position, nickname } = req.user.user;
    await this.userModel.deleteOne({ _id });
    await this.userInfoModel.deleteOne({ userId: _id });
    return {
      msg: `${nickname} 회원탈퇴 완료`,
    };
  }

  async updateUser(
    updateUserInfoDto: UpdateUserInfoDto,
    req: any,
  ): Promise<any> {
    const { _id } = req.user.user;
    const {
      nickname,
      introduction,
      profileUrl,
      position,
      front,
      back,
      design,
      portfolioUrl,
      url,
    } = updateUserInfoDto;

    await this.userModel.findOneAndUpdate(
      { _id },
      {
        $set: { nickname, profileUrl },
      },
    );

    await this.userInfoModel.findOneAndUpdate(
      {
        userId: _id,
      },
      {
        $set: {
          position,
          introduction,
          front,
          back,
          design,
          portfolioUrl,
          url,
        },
      },
    );
    return {
      msg: `${nickname} 회원정보 수정 완료`,
    };
  }

  async getUserInfo(req: any) {
    const { _id } = req.user.user;
    const userInfo = await this.userInfoModel
      .findOne({ userId: _id })
      .populate('userId', { password: false });

    const projectData = await this.projectModel
      .find()
      .where('participantList.userId')
      .in([_id])
      .populate('boardId', { updateAt: 0, createdAt: 0 })
      .select({ updatedAt: 0, createdAt: 0 });

    return {
      msg: ` 회원정보 조회 완료`,
      userInfo,
      projectData,
      totalProject: projectData.length,
    };
  }
}
