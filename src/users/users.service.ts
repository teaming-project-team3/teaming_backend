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
import { UsersRepository } from './repository/users.repository';
@Injectable()
export class UsersService {
  private dataSort;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfo>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private portfolioScrap: PortfolioScrap,
  ) {
    this.dataSort = function (a, b) {
      const scoreObj = {
        1: 15,
        2: 30,
        3: 40,
        4: 50,
      };
      if (
        scoreObj[a.time] + scoreObj[a.rate] >
        scoreObj[b.time] + scoreObj[b.rate]
      )
        return -1;
      else if (
        scoreObj[a.time] + scoreObj[a.rate] <
        scoreObj[b.time] + scoreObj[b.rate]
      )
        return 1;
      else return 0;
    };
  }

  async stackScoring(front, back, design) {
    const front_ab_score = front.ability.sort(this.dataSort)[0] ?? [];
    const front_sk_score = front.skills.sort(this.dataSort)[0] ?? [];
    const back_ab_score = back.ability.sort(this.dataSort)[0] ?? [];
    const back_sk_score = back.skills.sort(this.dataSort)[0] ?? [];
    const design_sk_score = design.skills.sort(this.dataSort)[0] ?? [];

    const scoreObj = {
      1: 15,
      2: 30,
      3: 40,
      4: 50,
    };

    const payload = {
      front: {
        ability: {
          name: front_ab_score.name ?? '',
          score: front_ab_score.time
            ? scoreObj[front_ab_score.time] + scoreObj[front_ab_score.rate]
            : -1,
        },
        skills: {
          name: front_sk_score.name ?? '',
          score: front_sk_score.time
            ? scoreObj[front_sk_score.time] + scoreObj[front_sk_score.rate]
            : -1,
        },
      },
      back: {
        ability: {
          name: back_ab_score.name ?? '',
          score: back_ab_score.time
            ? scoreObj[back_ab_score.time] + scoreObj[back_ab_score.rate]
            : -1,
        },
        skills: {
          name: back_sk_score.name ?? '',
          score: back_sk_score.time
            ? scoreObj[back_sk_score.time] + scoreObj[back_sk_score.rate]
            : -1,
        },
      },
      design: {
        skills: {
          name: design_sk_score.name ?? '',
          score: design_sk_score.time
            ? scoreObj[design_sk_score.time] + scoreObj[design_sk_score.rate]
            : -1,
        },
      },
      reliability: 50,
      cooperation: 50,
    };

    return payload;
  }

  async insertInfo(suveyInfoDto: SuveyInfoDto, req: any): Promise<any> {
    const { _id, nickname } = req.user.user;
    const { position, front, back, design, url, portfolioUrl } = suveyInfoDto;
    let protfolioOgData: string[];
    try {
      if (portfolioUrl) {
        protfolioOgData = await this.portfolioScrap.ogdataScrap(portfolioUrl);
      }

      await this.userModel.findOneAndUpdate(
        { _id },
        {
          $set: { suveyCheck: true },
        },
      );

      const suveyScore = await this.stackScoring(front, back, design);
      console.log('✅==========suveyScore==========✅');
      console.log(suveyScore);
      console.log('✅==========suveyScore==========✅');

      await this.userInfoModel
        .findOneAndUpdate()
        .where('userId')
        .equals(_id)
        .set({
          front,
          back,
          design,
          position,
          portfolioUrl: protfolioOgData,
          url,
          stack: suveyScore,
        });

      return {
        msg: `${position} 설문조사 완료`,
      };
    } catch (error) {
      return {
        msg: `url을 다시 입력해주세요`,
      };
    }
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

    await this.userModel
      .findOneAndUpdate()
      .where('_id')
      .equals(_id)
      .set({ nickname, profileUrl });

    await this.userInfoModel
      .findOneAndUpdate()
      .where('userId')
      .equals(_id)
      .set({
        position,
        introduction,
        front,
        back,
        design,
        portfolioUrl,
        url,
      });

    return {
      msg: `${nickname} 회원정보 수정 완료`,
    };
  }

  async getUserInfo(req: any) {
    const { _id } = req.user.user;
    console.log('✅================getUserInfo=================✅');

    const userInfo = await this.userInfoModel
      .findOne({ userId: _id })
      .populate('userId', { password: false });

    const customInfo = JSON.parse(JSON.stringify(userInfo));
    customInfo['nickname'] = userInfo.userId['nickname'];

    const projectData = await this.projectModel
      .find()
      .where('participantList.userId')
      .in([_id])
      .populate('boardId', { updateAt: 0, createdAt: 0 })
      .select({ updatedAt: 0, createdAt: 0 });

    return {
      msg: ` 회원정보 조회 완료`,
      userInfo: customInfo,
      projectData,
      totalProject: projectData.length,
    };
  }

  async getUserInfoByUserId(userId) {
    console.log('✅================getUserInfoByUserId=================✅');
    console.log(userId);

    const userInfo = await this.userInfoModel
      .findOne({ userId: userId })
      .populate('userId', { password: false });

    const customInfo = JSON.parse(JSON.stringify(userInfo));
    customInfo['nickname'] = userInfo.userId['nickname'];

    const projectData = await this.projectModel
      .find()
      .where('participantList.userId')
      .in([userId])
      .populate('boardId', { updateAt: 0, createdAt: 0 })
      .select({ updatedAt: 0, createdAt: 0 });

    return {
      msg: ` 회원정보 조회 완료`,
      userInfo: customInfo,
      projectData,
      totalProject: projectData.length,
    };
  }
}
