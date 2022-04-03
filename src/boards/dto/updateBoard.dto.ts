import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class updateBoardDto {
  _id: string; // 보드아이디

  @IsString()
  title: string; // 제목

  @IsString()
  nickname: string; // 작성자

  @IsString()
  contents: string; // 콘텐츠

  @IsString()
  subContents: string; // 한줄소개

  @IsArray()
  imgUrl: string[]; // 이미지

  @IsArray()
  stack: [string, string, number][]; // 직무, 스킬, 인원

  @IsArray()
  left: number[]; // 들어온 인원 / 디자인, 프론트, 백 순서

  period: Date; // 모집기간

  @IsNumber()
  likeCount: number; // 좋아요 수

  @IsArray()
  referURL: string[] | null;
}
