export class Board {
  _id: string;
  title: string;
  imgUrl: string[];
  subContents: string;
  stack: [string, string, number][]; // 디자인,프론트,백 / 총인원 / 인원
  nickname: string;
  profileUrl: string;
  period: Date;
  likeCount: number;
}

export class Mate {
  _id: object;
  nickname: string;
  profileUrl: string;
  position: string;
  portfolioUrl: Array<object>;
  // project: number; // 티밍에서 프로젝트를 진행한 횟수
  createdAt: Date;
}

export class getAllBoard {
  rankBoards: Board[];
  deadlineBoards: Board[];
  designBoards: Board[];
  devBoards: Board[];
  designMates: Mate[];
  devMates: Mate[];
}

export class getOneBoard {
  _id: string; // 보드아이디
  title: string; // 제목
  nickname: string; // 작성자
  contents: string; // 콘텐츠
  subContents: string; // 한줄소개
  imgUrl: string[]; // 이미지
  stack: [string, string, number][]; // 직무, 스킬, 인원
  left: number[]; // 들어온 인원 / 디자인, 프론트, 백 순서
  period: Date; // 모집기간
  skills: string[]; // 스킬들
  likeCount: number; // 좋아요 수
  referURL: string | null;
  createdAt: Date; // 작성일
}

export class getOneMate {}
