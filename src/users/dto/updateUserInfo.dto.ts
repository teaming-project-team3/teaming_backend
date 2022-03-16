import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserInfoDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  ability: [[name: string, time: string, rate: string]];

  @IsNotEmpty()
  skills: [[name: string, time: string, rate: string]];

  @IsNotEmpty()
  portfolioUrl: [];

  @IsString()
  gitUrl: string | null;

  @IsString()
  bojUrl: string | null;

  @IsString()
  url: string | null;
}
