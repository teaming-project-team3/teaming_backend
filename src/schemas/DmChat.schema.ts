import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Document, ObjectId, Types } from 'mongoose';

export type DmChatDocument = DmChat & Document;
const options: SchemaOptions = {
  collection: 'dmchats',
  timestamps: true,
};
@Schema(options)
export class DmChat {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  // projectId 임시 컬럼
  @Prop({ type: String })
  room: string;

  // projectId 임시 컬럼
  @Prop({ type: [String] })
  participantList: [];

  @Prop({
    default: [],
    type: [
      {
        _id: false,
        sender: { type: String },
        text: { type: String },
        date: { type: String },
      },
    ],
  })
  messageData: [];
}

export const DmChatSchema = SchemaFactory.createForClass(DmChat);
