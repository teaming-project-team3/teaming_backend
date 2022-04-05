import { IsDate, IsNotEmpty, IsObject } from 'class-validator';
import { Types } from 'mongoose';

export class projectDto {
  @IsNotEmpty()
  @IsObject()
  boardId: Types.ObjectId;

  @IsNotEmpty()
  @IsObject()
  userId: Types.ObjectId;

  @IsObject()
  participantList: {
    userId: Types.ObjectId[];
    position: string[];
  };
}
