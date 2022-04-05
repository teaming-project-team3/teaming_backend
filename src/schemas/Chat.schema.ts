import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Document, ObjectId, Types } from 'mongoose';

export type ChatDocument = Chat & Document;
const options: SchemaOptions = {
  collection: 'chats',
  timestamps: true,
};
@Schema(options)
export class Chat {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  // projectId 임시 컬럼
  @Prop({ type: String })
  projectId: string;

  // projectId 임시 컬럼
  @Prop({ type: [Object], default: [] })
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

export const ChatSchema = SchemaFactory.createForClass(Chat);
