import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUrl } from 'class-validator';

export class updateBoardDto {
  @ApiProperty({
    example: '프로젝트 제목 수정',
    description: 'title',
    required: true,
  })
  @IsString()
  title: string; // 제목

  @ApiProperty({
    example: '프로젝트 컨텐츠 수정',
    description: 'contents',
    required: true,
  })
  @IsString()
  contents: string; // 콘텐츠

  @ApiProperty({
    example: '프로젝트 한줄소개 수정',
    description: 'subContents',
    required: true,
  })
  @IsString()
  subContents: string; // 한줄소개

  @ApiProperty({
    example: ['이미지1', '이미지2', '이미지3'],
    description: 'imgUrl',
    required: true,
  })
  imgUrl: string[] | null; // 이미지

  @ApiProperty({
    example: [
      ['dev', 'front', 3],
      ['design', 'ux/ui', 2],
    ],
    description: 'stack',
    required: true,
  })
  @IsArray()
  stack: [string, string, number][]; // 직무, 스킬, 인원

  @ApiProperty({
    example: new Date(),
    description: 'period',
    required: true,
  })
  period: Date; // 모집기간

  @ApiProperty({
    example: ['참고자료1', '참고자료2', '참고자료3'],
    description: 'referURL',
    required: false,
  })
  referURL: string | null;
}
