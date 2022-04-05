import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('서버 실행 확인')
export class AppController {
  @Get()
  findAll(): string {
    return 'Welcome!! This is Teaming server';
  }
}
