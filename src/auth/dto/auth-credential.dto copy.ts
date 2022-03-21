import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  // @Matches(/^[a-zA-Zㄱ-힣0-9]*$/g)
  @MinLength(3)
  @MaxLength(20)
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  passwordCheck: string;

  @IsString()
  profileUrl: string;
}
