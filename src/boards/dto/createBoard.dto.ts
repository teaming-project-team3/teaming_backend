import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class createBoardDto {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  @ApiProperty({
    example: 'Swagger 테스트 글 입니다.',
    description: 'title',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: ['url1', 'url2'],
    description: 'imgUrl',
    required: true,
  })
  @IsArray()
  imgUrl: string[] | null;

  @ApiProperty({
    example: 'Swagger 테스트 글 입니다.',
    description: 'contents',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  contents: string;

  @ApiProperty({
    example: 'Swagger 테스트 글 입니다.',
    description: 'subContents',
    required: true,
  })
  @IsString()
  subContents: string | null;
  @IsNotEmpty()
  @ApiProperty({
    example: [
      ['dev', 'back', 2],
      ['dev', 'front', 3],
    ],
    description: 'stack',
    required: true,
  })
  @IsArray()
  stack: [string, string, number][];

  @ApiProperty({
    example: '2022-04-05',
    description: 'period',
    required: true,
  })
  @IsNotEmpty()
  period: Date | string;

  @ApiProperty({
    example: ['url1', 'url2'],
    description: 'referURL',
    required: true,
  })
  referURL: string[] | null;

  createdAt: Date;

  updateAt: Date;
}
