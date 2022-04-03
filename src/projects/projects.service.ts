import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { projectDto } from 'src/boards/dto/project.dto';
import { Board, BoardDocument } from 'src/schemas/Board.schema';
import { Project, ProjectDocument } from 'src/schemas/Project.schema';
import { User, UserDocument } from 'src/schemas/User.schema';
import { UserInfo, UserInfoDocument } from 'src/schemas/UserInfo.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(UserInfo.name) private UserInfoModel: Model<UserInfoDocument>,
  ) {}

  async addProjectPerson(id, user) {
    const _id = new Types.ObjectId(id);
    const findProject: any = await this.projectModel.findOne({ _id }).exec();
    const findUserInfo = await this.UserInfoModel.findOne({
      userId: user._id,
    }).exec();

    findProject.participantList.userId.push(user._id);
    findProject.participantList.position.push(findUserInfo.position);

    console.log(findProject.participantList);

    await this.projectModel
      .findByIdAndUpdate(
        { _id },
        { $set: { participantList: findProject.participantList } },
      )
      .exec();

    return { message: '프로젝트에 추가 되었습니다.' };
  }
}
