import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import mongoose from 'mongoose';
import { AuthService } from './auth.service';
import {
  AuthCredentialsDto,
  AuthSignUpDto,
  UserKakaoDto,
} from './dto/auth-credential.dto';
import { GetUser } from './get-user.decorator';
import { User } from 'src/schemas/User.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authSignUpDto: AuthSignUpDto): Promise<object> {
    return this.authService.signIn(authSignUpDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(String(user._id));
    const test = String(user._id);
    console.log(new mongoose.Types.ObjectId(test));
    const temp = Object(test);
    console.log(temp);
  }

  @Get('/kakao')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('/kakao/redirect')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req): Promise<any> {
    return this.authService.kakaoLogin(req.user as UserKakaoDto);
  }
}
