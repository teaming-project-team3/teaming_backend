import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { kStringMaxLength } from 'buffer';

export type UserInfoDocument = UserInfo & Document;

const options: SchemaOptions = {
  collection: 'userinfos',
  timestamps: true,
};
@Schema(options)
export class UserInfo extends Document {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  @IsNotEmpty()
  userId: ObjectId;

  @Prop({ default: '' })
  position: string;

  @Prop({ default: '' })
  introduction: string;

  @Prop({
    default: {},
    type: {
      _id: false,
      ability: {
        type: [
          {
            _id: false,
            name: String,
            time: String || Number,
            rate: String || Number,
          },
        ],
      },
      skills: {
        type: [
          {
            _id: false,
            name: String,
            time: String || Number,
            rate: String || Number,
          },
        ],
      },
    },
  })
  front: object;

  @Prop({
    default: {},
    type: {
      _id: false,
      ability: {
        type: [
          {
            _id: false,
            name: String,
            time: String || Number,
            rate: String || Number,
          },
        ],
      },
      skills: {
        type: [
          {
            _id: false,
            name: String,
            time: String || Number,
            rate: String || Number,
          },
        ],
      },
    },
  })
  back: object;

  @Prop({
    default: {},
    type: {
      _id: false,
      skills: {
        type: [
          {
            _id: false,
            name: String,
            time: String || Number,
            rate: String || Number,
          },
        ],
      },
    },
  })
  design: object;

  @Prop({
    type: [
      {
        _id: false,
        title: String,
        imageUrl: [String],
        description: String,
        url: String,
        period: String,
      },
    ],
  })
  portfolioUrl: object[];

  @Prop({
    default: '',
  })
  url: string;

  @Prop({
    default: {
      front: {
        ability: {
          name: '',
          score: -1,
        },
        skills: {
          name: '',
          score: -1,
        },
      },
      back: {
        ability: {
          name: '',
          score: -1,
        },
        skills: {
          name: '',
          score: -1,
        },
      },
      design: {
        skills: {
          name: '',
          score: -1,
        },
      },
      reliability: 50,
      cooperation: 50,
    },
    type: {
      _id: false,
      front: {
        _id: false,
        type: {
          ability: {
            _id: false,
            type: { name: String, score: Number },
          },
          skills: {
            _id: false,
            type: { name: String, score: Number },
          },
        },
      },
      back: {
        _id: false,
        type: {
          ability: {
            _id: false,
            type: { name: String, score: Number },
          },
          skills: {
            _id: false,
            type: { name: String, score: Number },
          },
        },
      },
      design: {
        _id: false,
        type: {
          _id: false,
          skills: {
            _id: false,
            type: {
              name: { type: String },
              score: { type: Number },
            },
          },
        },
      },
      reliability: { type: Number },
      cooperation: { type: Number },
    },
  })
  stack: object;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
