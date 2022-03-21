import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId, Types } from 'mongoose';

export type DevDocument = Dev & Document;
const options: SchemaOptions = {
  collection: 'devs',
  timestamps: true,
};
@Schema(options)
export class Dev {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  userId: object;

  @Prop({
    default: null,
  })
  gitUrl: string; // 깃허브

  @Prop({
    default: null,
  })
  bojUrl: string; // 백준

  @Prop({
    default: null,
  })
  ability: Array<[string, number, number]>; // 프로그램 언어

  // 프로그램 언어/프레임워크 사용기간 능숙도 상중하

  @Prop({
    default: null,
  })
  skills: Array<[string, number, number]>; // 프레임워크, 라이브러리 등

  @Prop({
    default: null,
  })
  portfolioUrl: string[]; // 포트폴리오 주소 3개
}

export const DevSchema = SchemaFactory.createForClass(Dev);
