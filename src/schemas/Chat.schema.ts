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

  // @Prop({ type: Types.ObjectId, required: true, ref: 'Project' })
  // @IsNotEmpty()
  // projectId: ObjectId;

  // projectId 임시 컬럼
  @Prop({ type: String, required: true })
  projectId: string;

  // projectId 임시 컬럼
  @Prop({ type: [String], required: true })
  participantList: [];

  @Prop({
    default: [],
    type: {
      sender: { type: String, required: true },
      text: { type: String, required: true },
      date: { type: Date, required: true },
    },
  })
  messageData: [];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
