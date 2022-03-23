import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { SuveyInfoDto } from './dto/suveyInfo.dto';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('/')
  @UseGuards(AuthGuard())
  userUpdate(
    @Body(ValidationPipe) updateUserInfoDto: UpdateUserInfoDto,
    @Req() req,
  ): Promise<any> {
    return this.usersService.updateUser(updateUserInfoDto, req);
  }
  @Delete('/')
  @UseGuards(AuthGuard())
  userDelete(@Req() req): Promise<any> {
    return this.usersService.deleteUser(req);
  }

  @Post('/suvey')
  @UseGuards(AuthGuard())
  suveyUser(
    @Body(ValidationPipe) suveyInfoDto: SuveyInfoDto,
    @Req() req,
  ): Promise<any> {
    return this.usersService.insertInfo(suveyInfoDto, req);
  }

  @Get('/mypage')
  @UseGuards(AuthGuard())
  getUserInfo(@Req() req): Promise<any> {
    return this.usersService.getUserInfo(req);
  }
}
