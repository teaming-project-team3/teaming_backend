import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import mongoose from 'mongoose';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, AuthSignUpDto } from './dto/auth-credential.dto';
import { GetUser } from './get-user.decorator';
import { User } from './schemas/user.schema';

@Controller('users')
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
}
