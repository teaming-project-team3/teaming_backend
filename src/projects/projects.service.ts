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
  async addProjectPerson(user, project) {
    const findUserInfo = await this.UserInfoModel.findOne({
      userId: user._id,
    }).exec();

    project.participantList.userId.push(user._id);
    project.participantList.position.push(findUserInfo.position);

    console.log(project.participantList);

    await this.projectModel
      .findByIdAndUpdate(
        { id: project._id },
        { $set: { participantList: project.participantList } },
      )
      .exec();

    return { message: '프로젝트에 추가 되었습니다.' };
  }

  // 프로젝트 들어갈 때 일어나는 것들
  async project(id, user) {
    const _id = new Types.ObjectId(id);
    const findProject = await this.projectModel.findOne({ _id });

    const leaderCheck = this.leaderCheck(user, findProject);

    if (!leaderCheck) {
      const projectInCheck = this.inProjectCheck(user, findProject);

      if (!projectInCheck) {
        this.addProjectPerson(user, findProject);
        return {
          leaderCheck,
          message: `${user.nickname}님 새로운 프로젝트에 참가했습니다.`,
        };
      }

      return {
        leaderCheck,
        message: `${user.nickname}님 어서오세요.`,
      };
    }

    return {
      leaderCheck,
      message: `🌟${user.nickname}님 어서오세요.`,
    };
  }
}
