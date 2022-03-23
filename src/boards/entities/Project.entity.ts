import { Types } from 'mongoose';

export class projectEntity {
  boardId: object;
  userId: object;
  participantList: {
    userId: Types.ObjectId;
    position: string;
  }[];
}
