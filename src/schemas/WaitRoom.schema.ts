import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WaitRoomDocument = WaitRoom & Document;

@Schema()
export class WaitRoom {
  @Prop({ type: Object })
  boardId: object;

  @Prop({ type: Object })
  rootId: object;
}

export const WaitRoomSchema = SchemaFactory.createForClass(WaitRoom);
