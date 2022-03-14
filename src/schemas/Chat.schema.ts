import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ type: Object, required: false })
  _id: object;

  @Prop({ type: Object })
  fromUserId: object;

  @Prop({ type: [String] })
  toUserId: string[];

  @Prop({ type: Object, required: true })
  userId: object;

  @Prop({ type: Date, required: true })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
