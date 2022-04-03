import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { SchemaTypes, Types, Document } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema()
export class Board {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: [String], required: true })
  imgUrl: string[];

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

  @Prop({ type: String, default: null })
  referURL: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop()
  updateAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
