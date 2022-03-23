import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { SchemaTypes, Types, Document } from 'mongoose';

export type BoardDocument = Board & Document;

const options: SchemaOptions = {
  timestamps: true,
};
@Schema(options)
export class Board {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  imgUrl: string;

  @Prop({ type: String, required: true })
  contents: string;

  @Prop({ type: String, required: true })
  subContents: string;

  @Prop({ required: true })
  stack: [string, string, number][];

  @Prop({ type: Date, required: true })
  period: Date;

  @Prop({ type: Number, default: 0 })
  likeCount: number;

  @Prop({ type: [String], default: null })
  referURL: string[];

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop()
  updateAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
