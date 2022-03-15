import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type DesignDocument = Design & Document;

@Schema()
export class Design {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: Object, required: true })
  userId: object;

  @Prop({
    default: null,
  })
  behanceUrl: string;

  @Prop({
    default: null,
  })
  skills: Array<[string, number, number]>; // tool 사용기간 ex) 피그마 1년 작품수

  @Prop({
    default: null,
  })
  portfolioUrl: string[]; // 포트톨리오 주소 3개

  @Prop({ type: Date, required: true })
  createdAt: Date;
}

export const DesignSchema = SchemaFactory.createForClass(Design);
