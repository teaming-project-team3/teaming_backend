import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { projectDto } from 'src/boards/dto/project.dto';
import { participantList } from 'src/boards/entities/schemaValue.entity';
import { Board, BoardDocument } from 'src/schemas/Board.schema';
import { Project, ProjectDocument } from 'src/schemas/Project.schema';
import { User, UserDocument } from 'src/schemas/User.schema';
import { UserInfo, UserInfoDocument } from 'src/schemas/UserInfo.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(UserInfo.name) private UserInfoModel: Model<UserInfoDocument>,
  ) {}

  // 프로젝트 참가 확인
  async inProjectCheck(user, project) {
    const participantList: participantList = project.participantList;
    const check = participantList.userId.indexOf(user._id);

    if (check !== -1) {
      return true;
    }
    return false;
  }

  // 프로젝트 리더 확인
  async leaderCheck(user, project) {
    const leader = project.userId;
    if (user._id === leader) {
      return true;
    }
    return false;
  }

  // 프로젝트 참가
  async addProjectPerson(user, id) {
    const _id = new Types.ObjectId(id);
    const findUserInfo = await this.UserInfoModel.findOne({
      userId: user._id,
    }).exec();
    const findProject: any = await this.projectModel.findOne({ _id });

    findProject.participantList.userId.push(user._id);
    findProject.participantList.position.push(findUserInfo.position);

    console.log(findProject.participantList);

    await this.projectModel
      .findByIdAndUpdate(
        { _id: findProject._id },
        { $set: { participantList: findProject.participantList } },
      )
      .exec();

    return {
      message: `${user.nickname}님 새로운 프로젝트에 참가했습니다.`,
    };
  }

  async outProject(user, id) {
    const _id = new Types.ObjectId(id);
    const findProject: any = await this.projectModel.findOne({ _id });
    const userList = findProject.participantList.userId;

    for (const idx in userList) {
      if (user._id === userList[idx]) {
        findProject.participantList.userId.splice(idx, 1);
        findProject.participantList.position.splice(idx, 1);
      }
    }

    await this.projectModel
      .findByIdAndUpdate(
        { _id: findProject._id },
        { $set: { participantList: findProject.participantList } },
      )
      .exec();

    return {
      message: `${user.nickname}님이 프로젝트에서 나갔습니다.`,
    };
  }

  // 프로젝트 들어갈 때
  async project(id, user) {
    const _id = new Types.ObjectId(id);
    const findProject = await this.projectModel.findOne({ _id });

    const leaderCheck = this.leaderCheck(user, findProject);

    if (!leaderCheck) {
      const projectInCheck = this.inProjectCheck(user, findProject);

      return {
        leaderCheck,
        projectInCheck,
        message: `${user.nickname}님 어서오세요.`,
      };
    }

    return {
      leaderCheck,
      projectInCheck: true,
      message: `🌟${user.nickname}님 어서오세요.`,
    };
  }

  async startProject(user, id) {
    const _id = new Types.ObjectId(id);
    const findProject = await this.projectModel.findById({ _id });
    const startTime = new Date();

    if (findProject.userId === user._id) {
      await this.projectModel.updateOne(
        { _id },
        {
          $set: {
            createdAt: startTime,
          },
        },
      );
      return {
        startTime,
        message: '시작되었습니다.',
      };
    }

    return { message: '시작할 수 없습니다.' };
  }
}
