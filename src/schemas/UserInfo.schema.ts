import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export type UserInfoDocument = UserInfo & Document;

const options: SchemaOptions = {
  collection: 'userinfos',
  timestamps: true,
};
@Schema(options)
export class UserInfo extends Document {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  @IsNotEmpty()
  userId: object;

  @Prop({
    default: {},
    type: {
      _id: false,
      ability: { type: Array },
      skills: { type: Array },
    },
  })
  front: object;

  @Prop({
    default: {},
    type: {
      _id: false,
      ability: { type: Array },
      skills: { type: Array },
    },
  })
  back: object;

  @Prop({
    default: {},
    type: {
      _id: false,
      skills: { type: Array },
    },
  })
  design: object;

  @Prop({
    default: null,
  })
  portfolioUrl: Array<string>; // 포트폴리오 주소 3개
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
