import { IsDate, IsString } from 'class-validator';

export class userDto {
  @IsString()
  email: string;

  @IsString()
  nickname: string;

  @IsString()
  password: string;

  @IsString()
  profileUrl: string;

  @IsString()
  position: string;

  @IsDate()
  createdAt: Date;

  updatedAt: Date;
}
