import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiDefaultResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { SuveyInfoDto } from './dto/suveyInfo.dto';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users API')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: '유저 정보 Update API',
    description: '',
  })
  @ApiOkResponse({ description: '정보 수정 성공' })
  @ApiDefaultResponse({ description: '정보 수정 실패' })
  @Put('/')
  @UseGuards(AuthGuard())
  userUpdate(
    @Body(ValidationPipe) updateUserInfoDto: UpdateUserInfoDto,
    @Req() req,
  ): Promise<any> {
    return this.usersService.updateUser(updateUserInfoDto, req);
  }

  @ApiOperation({
    summary: '회원탈퇴 API',
    description: '',
  })
  @ApiOkResponse({ description: '회원탈퇴 성공' })
  @ApiDefaultResponse({ description: '회원탈퇴 실패' })
  @Delete('/')
  @UseGuards(AuthGuard())
  userDelete(@Req() req): Promise<any> {
    return this.usersService.deleteUser(req);
  }

  @ApiOperation({
    summary: '설문조사 API',
    description: '',
  })
  @ApiOkResponse({ description: '설문조사 성공' })
  @ApiDefaultResponse({ description: '설문조사 실패' })
  @Post('/suvey')
  @UseGuards(AuthGuard())
  suveyUser(
    @Body(ValidationPipe) suveyInfoDto: SuveyInfoDto,
    @Req() req,
  ): Promise<any> {
    return this.usersService.insertInfo(suveyInfoDto, req);
  }

  @ApiOperation({
    summary: 'mypage 정보 조회 API',
    description: '',
  })
  @ApiOkResponse({ description: 'mypage 정보 조회 성공' })
  @ApiDefaultResponse({ description: 'mypage 정보 조회 실패' })
  @Get('/mypage')
  @UseGuards(AuthGuard())
  getMyInfo(@Req() req): Promise<any> {
    return this.usersService.getUserInfo(req);
  }

  @ApiOperation({
    summary: '팀원 정보조회 API',
    description: '',
  })
  @ApiOkResponse({ description: '팀원 정보조회 성공' })
  @ApiDefaultResponse({ description: '팀원 정보조회 실패' })
  @Get('/:userId')
  @UseGuards(AuthGuard())
  getUserInfo(@Param() { userId }): Promise<any> {
    const _id = new mongoose.Types.ObjectId(userId);
    return this.usersService.getUserInfoByUserId(_id);
  }
}
