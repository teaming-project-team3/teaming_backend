import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from 'src/schemas/Board.schema';
import { Model, ObjectId } from 'mongoose';
import { createBoardDto } from './dto/createBoard.dto';
import { getAllBoard } from './entities/Board.entity';
import { Board as b, Mate as m, getOneBoard } from './entities/Board.entity';
import { User, UserDocument } from 'src/schemas/User.schema';
import { Project, ProjectDocument } from 'src/schemas/Project.schema';
import { Like, LikeDocument } from 'src/schemas/Like.schema';
import { userInfo } from './entities/user.entity';
import { projectEntity } from './entities/Project.entity';
import mongoose from 'mongoose';
import { UserInfo, UserInfoDocument } from 'src/schemas/UserInfo.schema';
import { participantList } from './entities/schemaValue.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(UserInfo.name) private UserInfoModel: Model<UserInfoDocument>,
    @InjectModel(Like.name) private LikeModel: Model<LikeDocument>,
  ) {}

  // ====================================================================
  // 좋아요 카운트
  async getLikeCount(boardId: ObjectId) {
    const like = await this.LikeModel.find({ boardId });
    return like.length;
  }
  // 스택 자리 체크
  async getStackCheck(boardId: ObjectId, stack: [string, string, number][]) {
    const participantList: participantList = await this.projectModel.findOne(
      { boardId },
      { _id: 0, participantList: 1 },
    );
    for (const list of participantList.position) {
      switch (list) {
        case 'design':
          --stack[0][2];
          break;
        case 'front':
          --stack[1][2];
          break;
        case 'back':
          --stack[2][2];
          break;
      }
    }
    return stack;
  }

  // 참석한 프로젝트 구하기
  async userInTheProject(user: ObjectId) {
    const participantList: any = await this.projectModel.find(
      {},
      { participantList: 1, _id: 0 },
    );
    let num = 0;

    try {
      for (const users of participantList.userId) {
        if (users.indexOf(user)) {
          num += 1;
        }
      }
    } catch (error) {}

    return num;
  }

  // 보드 제조합 => 불러올 갯수, 건너뛰기 (페이징), 카테고리, 유저 정보 ''이면 비로그인
  async boardMake(num: number, skip: number, userInfo: any): Promise<b[]> {
    const today = new Date();
    const findBoard = await this.boardModel
      .find({ period: { $gte: today } })
      .sort({ period: -1 })
      .skip(skip * num)
      .limit(num);
    const board: b[] = [];

    for (const list of findBoard) {
      const user = await this.userModel.findOne({ _id: list.userId });
      const likeCount = await this.getLikeCount(list._id);
      const stack = await this.getStackCheck(list._id, list.stack);

      const tempBoard: b = {
        _id: list._id,
        title: list.title,
        imgUrl: list.imgUrl,
        subContents: list.subContents,
        stack,
        nickname: user.nickname,
        profileUrl: user.profileUrl,
        period: list.period,
        likeCount,
      };
      board.push(tempBoard);
    }

    return board;
  }

  async mateMake(num: number, skip: number, position: string): Promise<m[]> {
    const findUser = await this.userModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip * num)
      .limit(num);
    const mate: m[] = [];

    for (const user of findUser) {
      const findInfo = await this.UserInfoModel.findOne();
      if (position === 'design' && findInfo.position === position) {
        const project = await this.userInTheProject(user._id);
        const tempMate: m = {
          _id: user._id,
          nickname: user.nickname,
          profileUrl: user.profileUrl,
          position: findInfo.position,
          portfolioUrl: findInfo.portfolioUrl,
          project,
          createdAt: user.createdAt,
        };
        mate.push(tempMate);
      } else {
        const project = await this.userInTheProject(user._id);
        const tempMate: m = {
          _id: user._id,
          nickname: user.nickname,
          profileUrl: user.profileUrl,
          position: findInfo.position,
          portfolioUrl: findInfo.portfolioUrl,
          project,
          createdAt: user.createdAt,
        };
        mate.push(tempMate);
      }
    }

    return mate;
  }

  // ====================================================================

  async getAllCategory(
    category: string,
    page: number,
  ): Promise<b[] | m[] | string> {
    const newBoard = await this.boardMake(12, page, '');

    switch (category) {
      case 'rank':
        return newBoard.sort((a, b) => b.likeCount - a.likeCount);
      case 'deadline':
        return newBoard.sort(
          (a, b) => +new Date(b.period) - +new Date(a.period),
        );
      case 'design':
        return newBoard
          .filter((item) => {
            return item.stack[0][2] > 0;
          })
          .sort((a, b) => {
            return b.stack[0][2] - a.stack[0][2];
          });
      case 'dev':
        return newBoard
          .filter((item) => {
            return item.stack[1][2] > 0;
          })
          .sort((a, b) => {
            return b.stack[1][2] - a.stack[1][2];
          });
      case 'design-mate':
        const newMateDesign = await this.mateMake(16, page, 'design');
        return newMateDesign.filter((item) => {
          return item.position === 'design';
        });
      case 'dev-mate':
        const newMateDev = await this.mateMake(16, page, '');
        return newMateDev;
    }

    return '없는 카테고리 입니다.';
  }

  // ====================================================================

  // ====================================================================

  // 메인페이지 보드 모두 띄우기
  async getAllBoards(): Promise<any> {
    const tempBoards = await this.boardMake(5, 0, '');
    const tempDsMate = await this.mateMake(5, 0, 'design');
    const tempDeMate = await this.mateMake(5, 0, '');

    // 프로젝트 카드 용도별 정렬
    const tempRank = tempBoards;
    const rankBoards = tempRank.sort((a, b) => b.likeCount - a.likeCount);

    const tempDeadline = tempBoards;
    const deadlineBoards = tempDeadline.sort((a, b) => +b.period - +a.period);

    const tempDesign = tempBoards;
    const designBoards = tempDesign.sort(
      (a, b) => b.stack[0][2] - a.stack[0][2],
    );

    const tempDev = tempBoards;
    const devBoards = tempDev.sort((a, b) => b.stack[0][2] - a.stack[0][2]);

    const tempDesignMate = tempDsMate;
    const designMates = tempDesignMate;

    const tempDevMate = tempDeMate;
    const devMates = tempDevMate;

    const boards: getAllBoard = {
      rankBoards,
      deadlineBoards,
      designBoards,
      devBoards,
      designMates,
      devMates,
    };

    // console.log(boards);

    return boards;
  }

  // Promise<Board>
  // ====================================================================
  // 프로젝트 카드 만들기 => 동시에 프로젝트 룸 생성
  async createBoard(board: createBoardDto, user: userInfo) {
    console.log('user', user._id);
    board.userId = user._id;
    board.period = new Date(board.period);
    const newBoard = new this.boardModel(board);

    try {
      const findUserInfo = await this.UserInfoModel.findById({
        userId: user._id,
      });
      newBoard.save();

      const participantList = {
        position: [findUserInfo.position],
        userId: [user._id],
      };

      const project: projectEntity = {
        boardId: newBoard._id,
        userId: user._id,
        participantList,
      };

      const newProjectRoom = new this.projectModel(project);
      newProjectRoom.save();

      return '프로젝트가 등록되었습니다.';
    } catch (error) {
      return {
        status: 401,
        message: '마이페이지에서 직군을 적어주세요.',
      };
    }
  }

  // ====================================================================
  // 프로젝트 카드 삭제 (현재 카드가 없을 때 다른 카드를 삭제하는 버그 있음)
  async deleteBoard(id: string, user: User) {
    const _id = new mongoose.Types.ObjectId(id);
    const find = await this.boardModel.findOne({ _id });
    if (find._id === id) {
      const del = await this.boardModel.findOneAndDelete({ _id });
      // console.log('del:', del);
      // if (del.deletedCount > 0) {
      //   return '삭제완료';
      // }
    }

    return `${user.nickname}님 지울게 없습니다.`;
  }

  // ====================================================================
  // 보드 1개 만들기
  async boardMakeOne(
    boardId: string,
    user: any | null,
  ): Promise<getOneBoard | string> {
    const board_id = new mongoose.Types.ObjectId(boardId);
    const findBoard = await this.boardModel.findById(
      { _id: board_id },
      { _id: 0 },
    );
    const nickname: string = await this.userModel.findById(
      {
        _id: new mongoose.Types.ObjectId(findBoard.userId),
      },
      { _id: 0, nickname: 1 },
    );
    const participantList: [string, string][] = await this.projectModel.findOne(
      { boardId: board_id, userId: findBoard.userId },
      { participantList: 1, _id: 0 },
    );

    const _id = findBoard._id.toString();

    // 남은 인원수 세기
    const left: number[] = [];
    let designCount = 0;
    let frontCount = 0;
    let backCount = 0;
    for (const list of participantList) {
      switch (list[1]) {
        case 'design':
          designCount += 1;
          break;
        case 'front':
          frontCount += 1;
          break;
        case 'back':
          backCount += 1;
          break;
      }
    }
    left.push(designCount);
    left.push(frontCount);
    left.push(backCount);

    // 좋아요 수
    const likeCount = await (
      await this.LikeModel.find({ boardId: board_id })
    ).length;

    const board: getOneBoard = {
      _id, // 아이디
      title: findBoard.title, // 제목
      nickname, //작성자
      contents: findBoard.contents, // 콘텐츠
      subContents: findBoard.subContents,
      imgUrl: findBoard.imgUrl, // 이미지
      stack: findBoard.stack, // 직무, 인원
      left, // 남은 인원
      period: findBoard.period, // 모집기간
      likeCount, // 좋아요 수
      referURL: findBoard.referURL,
      createdAt: findBoard.createdAt, // 작성일
    };

    return board;
  }

  // async mateMakeOne(nickname: string, user: any | null): Promise<m> {
  //   const findUser = await this.userModel.findOne({ nickname });
  //   return;
  // }
  // ====================================================================

  // 모달 보드 가져오기
  async getModelBoard(boardId): Promise<getOneBoard | string> {
    try {
      const board = await this.boardMakeOne(boardId, '');
      return board;
    } catch (error) {
      return '없는 보드입니다.';
    }
  }
}
