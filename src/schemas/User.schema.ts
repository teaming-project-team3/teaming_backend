import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;
const options: SchemaOptions = {
  toJSON: {
    getters: true,
    virtuals: true,
  },
};
@Schema(options)
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({
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
    default: null,
  })
  createdAt: Date;
  @Prop({
    default: null,
  })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
