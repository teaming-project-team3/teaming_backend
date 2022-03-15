import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DesignDocument = Design & Document;

@Schema()
export class Design {
  @Prop({ required: true })
  userId: object;

  @Prop()
  gitUrl: string;

  @Prop()
  bojUrl: string;

  @Prop([[String, Date, Number]])
  ability: Array<[string, Date, number]>;

  @Prop([[String, Date, Number]])
  skills: Array<[string, Date, number]>;

  @Prop([String])
  portfolioUrl: string[];

  @Prop()
  _id: object;
}

export const UserSchema = SchemaFactory.createForClass(Design);
