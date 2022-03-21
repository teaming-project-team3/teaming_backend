import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type WaitRoomDocument = WaitRoom & Document;

@Schema()
export class WaitRoom {
  @Prop({ type: Object, required: true })
  boardId: object;

  @Prop({ type: Object, required: true })
  rootId: object;

  @Prop()
  participantList: [string, string][];

}

export const WaitRoomSchema = SchemaFactory.createForClass(WaitRoom);
