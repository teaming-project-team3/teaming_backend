import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId, Types } from 'mongoose';

export type UserDocument = User & Document;

const options: SchemaOptions = {
  collection: 'users',
  timestamps: true,
};
@Schema(options)
export class User extends Document {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({
    default: null,
    index: { unique: true, dropDups: true },
    type: String,
  })
  email: string;

  @Prop({
    index: { unique: true, dropDups: true },
    required: true,
    type: String,
  })
  nickname: string;

  @Prop()
  password: string;

  @Prop({
    default: null,
  })
  profileUrl: string;

  @Prop({
    default: null,
  })
  position: string;

  @Prop({
    default: [],
  })
  dmRooms: [];

  @Prop({
    default: null,
  })
  kakaoId: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
