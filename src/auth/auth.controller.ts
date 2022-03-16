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
import {
  AuthCredentialsDto,
  AuthSignInDto,
  UserKakaoDto,
} from './dto/auth-credential.dto';
import { GetUser } from './get-user.decorator';
import { SuccessInterceptor } from '../common/interceptors/success.interceptor';
import { User } from 'src/schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('auth')
@UseInterceptors(SuccessInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectModel(User.name) private userModel: Model<User>, // 테스트 용
  ) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authSignInDto: AuthSignInDto): Promise<object> {
    return this.authService.signIn(authSignInDto);
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

  @Get('/kakao/logout')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async kakaoLogout(@Req() req): Promise<any> {
    return this.authService.kakaoLogout(req);
  }

  @Post('/test')
  // @UseGuards(AuthGuard())
  async test(@GetUser() userObj, @Req() req) {
    const temp = await this.userModel.create({
      email: 'test',
      nickname: 'test',
      password: 'test',
    });
    console.log('temp:     ' + temp);
    await this.userModel.findOneAndUpdate(
      { nickname: '1111' },
      {
        $push: { dmRooms: 'data.room' },
      },
    );
    await this.userModel.findOneAndUpdate(
      { nickname: '2222' },
      {
        $push: { dmRooms: 'data.room' },
      },
    );

    return await this.userModel
      .find()
      .or([{ nickname: '2222' }, { nickname: '1111' }]);

    // console.log(process.env);
    // console.log('======================================');
    // const { user } = userObj;
    // console.log(user);
    // console.log(String(user._id));
    // const test = String(user._id);
    // console.log(new mongoose.Types.ObjectId(test));
  }
}
