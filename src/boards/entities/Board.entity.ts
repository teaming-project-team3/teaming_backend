export interface Board {
  id: object;
  title: string;
  imgUrl: string;
  contents: string;
  stack: [string, number][]; // 디자인,프론트,백 / 총인원 / 인원
  nickname: string;
  profileUrl: string;
  period: Date;
  likeCheck: boolean;
  likeCount: number;
}

export interface Mate {
  nickname: string;
  profileUrl: string;
  portfolioUrl: string[];
  project: number; // 티밍에서 프로젝트를 진행한 횟수
  skills: Array<[string, number, number]>; // 사용 tool/언어, 기간, 능숙도
}

export class getAllBoard {
  rankBoards: Board[];
  deadlineBoards: Board[];
  designBoards: Board[];
  frontBoards: Board[];
  backBoards: Board[];
  designMates: Mate[];
  frontMates: Mate[];
  backMates: Mate[];
}
