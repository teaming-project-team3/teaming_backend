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

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  @IsNotEmpty()
  userId: ObjectId;

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
    default: [],
  })
  portfolioUrl: [];

  @Prop({
    default: null,
  })
  position: string;

  @Prop({
    default: false,
  })
  suveyCheck: boolean;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
