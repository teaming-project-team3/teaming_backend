import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ type: Object, required: false })
  _id: ObjectId;

  @Prop({ type: Object, required: true })
  userId: object;

  @Prop({ type: Object, required: true })
  chatId: object;

  @Prop()
  participantList: string[];

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop()
  closedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
