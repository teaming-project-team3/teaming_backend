import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserKakaoDto } from './dto/auth-userkakao.dto';
import { GetUser } from './get-user.decorator';
import { SuccessInterceptor } from '../common/interceptors/success.interceptor';
import { User } from 'src/schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthCredentialsDto } from './dto/auth-credential.dto copy';
import { AuthSignInDto } from './dto/auth-signin.dto';
import {
  ApiDefaultResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth API')
@UseInterceptors(SuccessInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectModel(User.name) private userModel: Model<User>, // 테스트 용
  ) {}

  @ApiOperation({
    summary: '회원가입 API',
    description: '회원가입 입니다.',
  })
  @ApiOkResponse({ description: '회원가입 성공' })
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiOperation({
    summary: '로그인 API',
    description: '',
  })
  @ApiOkResponse({ description: '로그인 성공' })
  @ApiDefaultResponse({ description: '로그인 실패' })
  @Post('/signin')
  signIn(@Body(ValidationPipe) authSignInDto: AuthSignInDto): Promise<object> {
    return this.authService.signIn(authSignInDto);
  }

  @ApiOperation({
    summary: '카카오 아이디 로그인 API',
    description: '',
  })
  @Get('/kakao')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @ApiOperation({
    summary: '카카오 아이디 로그인 콜백 API',
    description: '',
  })
  @ApiOkResponse({ description: '카카오 로그인 성공' })
  @Get('/kakao/redirect')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req): Promise<any> {
    return this.authService.kakaoLogin(req.user as UserKakaoDto);
  }

  @ApiOperation({
    summary: '카카오 아이디 로그아웃 API',
    description: '',
  })
  @ApiOkResponse({ description: '카카오 로그아웃 완료' })
  @Get('/kakao/logout')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async kakaoLogout(@Req() req): Promise<any> {
    return this.authService.kakaoLogout(req);
  }

  @ApiOperation({
    summary: 'Test API',
    description: '',
  })
  @Post('/test')
  @UseGuards(AuthGuard())
  async test(@GetUser() userObj, @Req() req) {
    return await this.userModel
      .find()
      .or([{ nickname: '2222' }, { nickname: '1111' }])
      .select({ _id: false, nickname: true, profileUrl: true });
  }
}
