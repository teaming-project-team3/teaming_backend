import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SuveyInfoDto } from './dto/suveyInfo.dto';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import { UsersService } from './users.service';

@Controller('users')
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
  suveyDev(
    @Body(ValidationPipe) suveyInfoDto: SuveyInfoDto,
    @Req() req,
  ): Promise<any> {
    console.log(req);
    console.log(suveyInfoDto);

    return this.usersService.insertInfo(suveyInfoDto, req);
  }

  @Post('/suvey/design')
  @UseGuards(AuthGuard())
  suveyDesign(
    @Body(ValidationPipe) suveyInfoDto: SuveyInfoDto,
    @Req() req,
  ): Promise<any> {
    return this.usersService.insertInfo(suveyInfoDto, req);
  }
}
