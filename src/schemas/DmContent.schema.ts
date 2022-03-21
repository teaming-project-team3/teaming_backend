import { DmList } from './DmList.schema';
import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  collection: 'dmcontents',
  timestamps: true,
};

@Schema(options)
export class DmContent extends Document {
  @Prop({
    type: {
      _id: { type: Types.ObjectId, required: true, ref: 'DmList' },
      roomName: { type: String, required: true },
    },
  })
  @IsNotEmpty()
  dmList: DmList;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  senderNickname: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  contents: string;
}

export const DmContentSchema = SchemaFactory.createForClass(DmContent);
