import { IsNotEmpty, IsString } from 'class-validator';

export class SuveyInfoDto {
  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  ability: [[name: string, time: string, rate: string]];

  @IsNotEmpty()
  skills: [[name: string, time: string, rate: string]];

  @IsNotEmpty()
  url: { git: string; boj: string };

  @IsNotEmpty()
  portfolioUrl: [];
}
