import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
const options: SchemaOptions = {
  timestamps: true,
};
@Schema(options)
export class User {
  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    unique: true,
    required: true,
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
