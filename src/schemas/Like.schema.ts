import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LikeDocument = Like & Document;

@Schema()
export class Like {
  @Prop({ type: Object, required: true })
  userId: object;

  @Prop({ type: Object, required: true })
  boardId: object;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
