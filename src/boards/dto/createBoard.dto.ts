import { IsArray, IsDate, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class createBoardDto {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  @IsString()
  title: string;

  @IsString()
  imgUrl: string[] | null;

  @IsString()
  contents: string;

  @IsString()
  subContents: string | null;

  @IsArray()
  stack: [string, string, number][];

  @IsDate()
  period: Date;

  referURL: string[] | null;

  @IsDate()
  createdAt: Date;

  updateAt: Date;
}
