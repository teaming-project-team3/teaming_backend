import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ type: Object, required: true })
  userId: object;

  @Prop({ type: Object, required: true })
  chatId: object;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop()
  updateAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
