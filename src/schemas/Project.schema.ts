import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types, SchemaTypes } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {

  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  boardId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
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
