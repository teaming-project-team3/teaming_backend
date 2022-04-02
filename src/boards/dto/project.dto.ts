import { IsDate, IsObject } from 'class-validator';
import { Types } from 'mongoose';

export class projectDto {
  @IsObject()
  boardId: Types.ObjectId;

  @IsObject()
  userId: Types.ObjectId;

  @IsObject()
  participantList: {
    userId: Types.ObjectId[];
    position: string[];
  };
}
