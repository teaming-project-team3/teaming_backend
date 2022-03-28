import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  boardId: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  chatId: Types.ObjectId;

  @Prop({
    default: {},
    type: {
      _id: false,
      userId: { type: Array },
      position: { type: Array },
    },
  })
  participantList: object;

  @Prop({ type: Date, required: false })
  createdAt: Date;

  @Prop()
  closedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
