import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class updateBoardDto {
  @IsString()
  title: string; // 제목

  @IsString()
  contents: string; // 콘텐츠

  @IsString()
  subContents: string; // 한줄소개

  @IsArray()
  imgUrl: string[]; // 이미지

  @IsArray()
  stack: [string, string, number][]; // 직무, 스킬, 인원

  period: Date; // 모집기간

  @IsArray()
  referURL: string[] | null;
}
