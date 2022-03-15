import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type DevDocument = Dev & Document;

@Schema()
export class Dev {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: Object, required: true })
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

  @Prop({ type: Date, required: true })
  CreatedAt: Date;
}

export const DevSchema = SchemaFactory.createForClass(Dev);
