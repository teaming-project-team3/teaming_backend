import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from './User.schema';

export type BoardDocument = Board & Document;

@Schema()
export class Board {
  @Prop({ type: Object, required: false })
  _id: object;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  imgUrl: string;

  @Prop({ type: String, required: true })
  contents: string;

  @Prop({ required: true })
  stech: [string, number][];

  @Prop({ type: String, required: true })
  period: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop()
  updateAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
