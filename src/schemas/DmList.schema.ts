import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions } from 'mongoose';

const options: SchemaOptions = {
  collection: 'dmlists',
  timestamps: true,
};

@Schema(options)
export class DmList extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  @IsNotEmpty()
  @IsString()
  roomName: string;
}

export const DmListSchema = SchemaFactory.createForClass(DmList);
