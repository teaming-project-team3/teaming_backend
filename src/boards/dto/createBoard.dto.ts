import { IsDate, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class createBoardDto {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  @IsString()
  title: string;

  @IsString()
  imgUrl: string;

  @IsString()
  contents: string;

  @IsString()
  subContents: string;

  stack: [string, string, number][];

  @IsDate()
  period: Date;

  referURL: string[] | null;
}
