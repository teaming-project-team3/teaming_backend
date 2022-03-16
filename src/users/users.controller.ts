import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SuveyInfoDto } from './dto/suveyInfo.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/suvey/dev')
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
