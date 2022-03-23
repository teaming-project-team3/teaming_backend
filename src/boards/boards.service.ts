import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from 'src/schemas/Board.schema';
import { Model } from 'mongoose';
import { createBoardDto } from './dto/createBoard.dto';
import { getAllBoard } from './entities/Board.entity';
import { categoryBoard } from './entities/CategoryBoard.entity';
import { categoryMate } from './entities/CategoryMate.entity';
import { Board as b, Mate as m } from './entities/Board.entity';
import { Design as ds, Dev as dv } from './entities/Position.entity';
import { User, UserDocument } from 'src/schemas/User.schema';
import { Project, ProjectDocument } from 'src/schemas/Project.schema';
import { userDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { Dev, DevDocument } from 'src/schemas/Dev.schema';
import { Design, DesignDocument } from 'src/schemas/Design.schema';
import { Like, LikeDocument } from 'src/schemas/Like.schema';
import { WaitRoom, WaitRoomDocument } from 'src/schemas/WaitRoom.schema';
import { userInfo } from './entities/user.entity';
import { waitRoomEntity } from './entities/WaiteRoom.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Dev.name) private DevModel: Model<DevDocument>,
    @InjectModel(Design.name) private DesignModel: Model<DesignDocument>,
    @InjectModel(Like.name) private LikeModel: Model<LikeDocument>,
    @InjectModel(WaitRoom.name)
    private WaiteRoomModel: Model<WaitRoomDocument>,
    private jwtService: JwtService,
  ) {}

  // ====================================================================

  async getAllCategory(
    category: string,
  ): Promise<categoryBoard[] | categoryMate[] | string> {
    let board: any;
    let mate: any;

    const newBoard: categoryBoard[] = [];
    if (
      category === 'rank' ||
      category === 'deadline' ||
      category === 'design' ||
      category === 'front' ||
      category === 'back'
    ) {
      const today = new Date();
      board = await this.boardModel.find({ period: { $gte: today } }).exec();
      for (const n in board) {
        // console.log(n);
        const id = board[n].userId;
        const user = await this.userModel.findById({ _id: id }).exec();
        const wait = await this.WaiteRoomModel.findById({
          boardId: board[n]._id,
        }).exec();

        let designCount = 0;
        let frontCount = 0;
        let backCount = 0;

        for (const w of wait.participantList) {
          switch (w[1]) {
            case 'design':
              ++designCount;
              break;
            case 'front':
              ++frontCount;
              break;
            case 'back':
              ++backCount;
              break;
          }
        }
        for (const nn of board[n].stack) {
          switch (nn[0]) {
            case 'design':
              nn[1] = nn[1] - designCount;
              break;
            case 'front':
              nn[1] = nn[1] - frontCount;
              break;
            case 'back':
              nn[1] = nn[1] - backCount;
              break;
          }

          board[n].stack = [nn[0], nn[1]];
          // console.log(board[n].stack);
        }

        const like = await this.LikeModel.find({
          boardId: board[n]._id,
        }).exec();

        const nb: b = {
          id: board[n]._id,
          title: board[n].title,
          imgUrl: board[n].imgUrl,
          contents: board[n].contents,
          stack: board[n].stack,
          nickname: user.nickname,
          profileUrl: user.profileUrl,
          period: board[n].period,
          likeCheck: false,
          likeCount: like.length,
        };
        // console.log(nb);
        newBoard.push(nb);
        // console.log(newBoard);
      }
    }

    switch (category) {
      case 'design-mate':
        mate = await this.userModel.find({ position: 'design' }).exec();
        break;
      case 'front-mate':
        mate = await this.userModel.find({ position: 'front' }).exec();
        break;
      case 'back-mate':
        mate = await this.userModel.find({ position: 'back' }).exec();
        break;
    }
    // console.log('mate', mate);

    // 매이트 구하기 카드
    const newMate: categoryMate[] = [];
    if (category === 'design-mate') {
      for (const n in mate) {
        const tempProject: any[] = await this.projectModel
          .find(
            {},
            {
              _id: 0,
              userId: 0,
              chatId: 0,
              createdAt: 0,
              updateAt: 0,
            },
          )
          .exec();
        const tempPortfolio: ds = await this.DesignModel.findOne({
          _id: mate[n]._id,
        }).exec();

        let project = 0;
        const portfolio = tempPortfolio.portfolioUrl.length;

        for (const p of tempProject) {
          if (p.participantList.indexOf(mate[n].userId) !== -1) {
            ++project;
          }
        }

        const nm = {
          id: mate[n]._id,
          nickname: mate[n].nickname,
          position: mate[n].position,
          project,
          portfolio,
          createdAt: mate[n].createdAt,
        };

        newMate.push(nm);
      }
    } else if (category === 'front-mate' || category === 'back-mate') {
      for (const n in mate) {
        console.log('n:', n);
        const tempProject: any[] = await this.projectModel.find().exec();
        const tempPortfolio: dv = await this.DevModel.findOne({
          userId: mate[n]._id,
        }).exec();

        let project = 0;
        let portfolio: number;
        if (tempPortfolio.portfolioUrl !== null) {
          portfolio = tempPortfolio.portfolioUrl.length;
        } else {
          portfolio = 0;
        }

        for (const p of tempProject) {
          if (p.participantList.indexOf(mate[n].userId) !== -1) {
            ++project;
          }
        }

        const nm = {
          id: mate[n]._id,
          nickname: mate[n].nickname,
          position: mate[n].position,
          project,
          portfolio,
          createdAt: mate[n].createdAt,
        };

        newMate.push(nm);
      }
    }

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
            return item.stack[0][1] > 0;
          })
          .sort((a, b) => {
            return b.stack[0][1] - a.stack[0][1];
          });

      case 'front':
        return newBoard
          .filter((item) => {
            return item.stack[1][1] > 0;
          })
          .sort((a, b) => {
            return b.stack[1][1] - a.stack[1][1];
          });
      case 'back':
        return newBoard
          .filter((item) => {
            return item.stack[2][1] > 0;
          })
          .sort((a, b) => {
            return b.stack[2][1] - a.stack[2][1];
          });
      case 'design-mate':
        return newMate.sort((a, b) => {
          return +a.createdAt - +b.createdAt;
        });
      case 'front-mate':
        return newMate
          .filter((item) => {
            return item.position === 'front';
          })
          .sort((a, b) => {
            return +a.createdAt - +b.createdAt;
          });
      case 'back-mate':
        return newMate
          .filter((item) => {
            return item.position === 'back';
          })
          .sort((a, b) => {
            return +a.createdAt - +b.createdAt;
          });
    }

    return '없는 카테고리 입니다.';
  }

  // ====================================================================
  // ====================================================================

  async getAllBoards(userInfo: User): Promise<any> {
    const today = new Date();
    const board: Board[] = await this.boardModel
      .find({ period: { $gte: today } })
      .exec();

    // 프로젝트 카드 기본
    const tempBoards: b[] = [];
    for (const n in board) {
      const user: any = await this.userModel
        .findOne({ _id: board[n].userId })
        .exec();

      const id = board[n]._id;
      const title = board[n].title;
      const contents = board[n].contents;
      const imgUrl = board[n].imgUrl;
      const nickname = user.nickname;
      const profileUrl = user.profileUrl;
      const period = board[n].period;
      let likeCheck = false;
      const likeCount = (await this.LikeModel.find({ boardId: board[n]._id }))
        .length;

      if (userInfo) {
        const check = await this.LikeModel.findOne({
          boardId: board[n]._id,
          userId: userInfo._id,
        }).exec();
        if (check) {
          likeCheck = true;
        }
      }

      let designCount = 0;
      let frontCount = 0;
      let backCount = 0;
      const wait = await this.WaiteRoomModel.findOne({
        boardId: board[n]._id,
      }).exec();
      for (const stack of wait.participantList) {
        switch (stack[0]) {
          case 'design':
            ++designCount;
            break;
          case 'front':
            ++frontCount;
            break;
          case 'back':
            ++backCount;
            break;
        }
      }
      board[n].stack[0][1] -= designCount;
      board[n].stack[1][1] -= frontCount;
      board[n].stack[2][1] -= backCount;
      const stack = board[n].stack;

      const tempBoard = {
        id,
        title,
        contents,
        imgUrl,
        nickname,
        profileUrl,
        period,
        likeCheck,
        likeCount,
        stack,
      };
      tempBoards.push(tempBoard);
    }

    // 프로젝트 카드 용도별 정렬
    const tempRank = tempBoards;
    const rankBoards = tempRank.sort((a, b) => b.likeCount - a.likeCount);

    const tempDeadline = tempBoards;
    const deadlineBoards = tempDeadline.sort();

    const tempDesign = tempBoards;
    const designBoards = tempDesign.sort();

    const tempFront = tempBoards;
    const frontBoards = tempFront.sort();

    const tempBack = tempBoards;
    const backBoards = tempBack.sort();

    // 디자인 매이트 구하기 카드
    const DesignMate = await this.DesignModel.find()
      .sort({ createdAt: 1 })
      .limit(5)
      .exec();
    let tempDsMate: m[];
    for (const n in DesignMate) {
      const user = await this.userModel
        .findOne({ _id: DesignMate[n].userId })
        .exec();
      tempDsMate[n].nickname = user.nickname;
      tempDsMate[n].profileUrl = user.profileUrl;
      tempDsMate[n].skills = DesignMate[n].skills;
      tempDsMate[n].profileUrl = user.profileUrl;

      const projects = await this.projectModel
        .find()
        .exists('closedAt', true)
        .exec();
      let projectCount = 0;
      if (projects.length) {
        for (const p of projects) {
          if (p.participantList.indexOf(user.nickname) !== -1) {
            ++projectCount;
          }
        }
      }
      tempDsMate[n].project = projectCount;
    }

    const tempDesignMate = tempDsMate;
    const designMates = tempDesignMate;

    // 개발자 매이트 구하기 카드
    const DevMate = await this.DevModel.find()
      .sort({ createdAt: 1 })
      .limit(5)
      .exec();
    let tempDeMate: m[];
    for (const n in DevMate) {
      const user = await this.userModel
        .findOne({ _id: DevMate[n].userId })
        .exec();
      tempDeMate[n].nickname = user.nickname;
      tempDeMate[n].profileUrl = user.profileUrl;
      tempDeMate[n].skills = DevMate[n].skills;
      tempDeMate[n].profileUrl = user.profileUrl;

      const projects = await this.projectModel.findOne({}).exec();
    }

    // 개발자 매이트 카드 용도별 정렬
    const tempFrontMate = tempDeMate;
    const frontMates = tempFrontMate;

    const tempBackMate = tempDeMate;
    const backMates = tempBackMate;

    const boards: getAllBoard = {
      rankBoards,
      deadlineBoards,
      designBoards,
      frontBoards,
      backBoards,
      designMates,
      frontMates,
      backMates,
    };

    console.log(boards);

    return boards;
  }

  // Promise<Board>
  // ====================================================================
  // 프로젝트 카드 만들기 => 동시에 대기 방 생성
  async createBoard(board: createBoardDto, user: userInfo) {
    console.log(user._id);
    board.createdAt = new Date();
    board.updateAt = board.createdAt;
    board.userId = user._id;

    const newBoard = new this.boardModel(board);
    newBoard.save();

    const room: waitRoomEntity = {
      boardId: newBoard._id,
      rootId: user._id,
      participantList: [['n', 'n']],
    };

    room.participantList = [['null', 'null']];
    const newWaitRoom = new this.WaiteRoomModel(room);
    newWaitRoom.save();

    return '글쓰기 (완)';
  }

  // 프로젝트 카드 삭제 (현재 카드가 없을 때 다른 카드를 삭제하는 버그 있음)
  async deleteBoard(id: string, user: User) {
    const find = await this.boardModel.findOne({ _id: id });
    if (find._id === id) {
      const del = await this.boardModel.deleteOne({ _id: id });
      console.log('del:', del);
      if (del.deletedCount > 0) {
        return '삭제완료';
      }
    }

    return `${user.nickname}님 지울게 없습니다.`;
  }

  async user(u: userDto) {
    u.createdAt = new Date();
    u.updatedAt = u.createdAt;
    const newUser = new this.userModel(u);
    newUser.save();
    return;
  }

  // 테스트 용
  async findUser() {
    const time = new Date('2022-03-11');
    console.log('쿼리 날짜 필터', time);
    const user = await this.userModel
      .updateOne({ _id: '622b6e37e5206f7e5b5bee97' }, { position: 'back' })
      .exec();
    const user1 = await this.userModel
      .findOne({ _id: '622b6e37e5206f7e5b5bee97' })
      .exec();
    const dev = {
      userId: user1._id,
      gitUrl: '',
      bojUrl: '',
      ability: [['javascript', 1, 2]],
      skills: [
        ['express', 1, 2],
        ['nest.js', 1, 1],
      ],
      portfolioUrl: ['https://github.com/jeongmisnu/node.jsStudy'],
    };

    const user2 = await new this.DevModel(dev);

    // console.log(String(user[0]._id));
    return user2.save();
  }
}

// {
//   "title":"test2",
//   "imgUrl":"url",
//   "contents":"test-test",
//   "stack": [["design", 2],["front", 2], ["back", 2]],
//   "period":"2022-04-25"
// }

// {
//   "title":"test4",
//   "imgUrl":"url",
//   "contents":"test-test",
//   "stack": [["node.js", 2],["react.js", 2]],
//   "period":"ss"
// }
