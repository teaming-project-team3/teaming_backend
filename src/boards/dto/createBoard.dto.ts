import { IsDate, IsString } from 'class-validator';

export class createBoardDto {
  _id: object;
  userId: object;

  @IsString()
  title: string;

  @IsString()
  imgUrl: string;

  @IsString()
  contents: string;

  stack: [string, number][];

  @IsDate()
  period: Date;

  @IsDate()
  createdAt: Date;

  updateAt: Date;
}
