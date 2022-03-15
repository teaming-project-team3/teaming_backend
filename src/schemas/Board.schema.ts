import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema()
export class Board {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: Object, required: true })
  userId: object;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  imgUrl: string;

  @Prop({ type: String, required: true })
  contents: string;

  @Prop({ required: true })
  stack: [string, number][];

  @Prop({ type: Date, required: true })
  period: Date;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop()
  updateAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
