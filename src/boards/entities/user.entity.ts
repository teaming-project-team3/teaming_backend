import { Types } from 'mongoose';

export class userInfo {
  _id: Types.ObjectId;
  email: string;
  nickname: string;
  profileUrl: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
}
