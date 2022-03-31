import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateUserInfoDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsString()
  introduction: string;

  @IsString()
  profileUrl: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsObject()
  front: {
    ability: [{ name: string; time: string; rate: string }];
    skills: [{ name: string; time: string; rate: string }];
  };

  @IsObject()
  back: {
    ability: [{ name: string; time: string; rate: string }];
    skills: [{ name: string; time: string; rate: string }];
  };

  @IsObject()
  design: {
    skills: [{ name: string; time: string; rate: string }];
  };

  @IsArray()
  portfolioUrl: [string];

  url: any;
}
