import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Dev } from 'src/schemas/Dev.schema';
import { Design } from 'src/schemas/Design.schema';
import { SuveyInfoDto } from './dto/suveyInfo.dto';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Dev.name) private devModel: Model<Dev>,
    @InjectModel(Design.name) private designModel: Model<Design>,
  ) {}

  async insertInfo(suveyInfoDto: SuveyInfoDto, req: any): Promise<any> {
    const { _id, nickname } = req.user.user;
    const { position, ability, skills, url, portfolioUrl } = suveyInfoDto;
    await this.userModel.findOneAndUpdate(
      { nickname },
      {
        $set: { position },
      },
    );

    if (position === 'design') {
      await this.designModel.create({
        userId: _id,
        behanceUrl: url,
        ability,
        skills,
        portfolioUrl,
      });
    } else {
      await this.devModel.create({
        userId: _id,
        gitUrl: url.git,
        bojUrl: url.boj,
        ability,
        skills,
        portfolioUrl,
      });
    }
    return {
      msg: `${position} 설문조사 완료`,
      boolean: true,
    };
  }

  async deleteUser(req: any): Promise<any> {
    const { _id, position, nickname } = req.user.user;
    await this.userModel.deleteOne({ _id });
    if (position === 'design') {
      await this.designModel.deleteOne({ userId: _id });
    } else {
      await this.devModel.deleteOne({ userId: _id });
    }

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
    const {
      nickname,
      position,
      ability,
      skills,
      portfolioUrl,
      gitUrl,
      bojUrl,
      url,
    } = updateUserInfoDto;

    await this.userModel.findOneAndUpdate(
      { _id },
      {
        $set: { position, nickname },
      },
    );

    if (position === 'design') {
      await this.designModel.findOneAndUpdate(
        { userId: _id },
        {
          $set: { behanceUrl: url, ability, skills, portfolioUrl },
        },
      );
    } else {
      await this.devModel.findOneAndUpdate(
        { userId: _id },
        {
          $set: {
            gitUrl: gitUrl,
            bojUrl: bojUrl,
            ability,
            skills,
            portfolioUrl,
          },
        },
      );
    }
    return {
      msg: `${nickname} 회원정보 수정 완료`,
      boolean: true,
    };
  }
}
