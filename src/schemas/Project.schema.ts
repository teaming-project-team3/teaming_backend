import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

const options: SchemaOptions = {
  timestamps: true,
};
@Schema(options)
export class Project {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Board' })
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

  @Prop({ type: Date })
  createdAt: Date;

  @Prop()
  closedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
