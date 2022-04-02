import { IsArray, IsDate, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class createBoardDto {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  @IsString()
  title: string;

  @IsArray()
  imgUrl: string[] | null;

  @IsString()
  contents: string;

  @IsString()
  subContents: string | null;

  @IsArray()
  stack: [string, string, number][];

  period: Date;

  referURL: string[] | null;

  createdAt: Date;

  updateAt: Date;
}
