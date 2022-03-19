import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
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

export class AuthSignInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  password: string;
}

export class UserKakaoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string | null;

  @IsString()
  @IsNotEmpty()
  kakaoId: string;

  @IsString()
  @IsNotEmpty()
  kakaoAccessToken: string;

  @IsString()
  provider: string;

  @IsString()
  profileUrl: string;
}
