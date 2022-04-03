import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';

@Controller('projects')
@ApiTags('Projects API')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // 프로젝트 인원 추가
  @Post('/:projectId')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: '프로젝트 참가 인원 추가',
    description: '프로젝트에 인원 추가',
  })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '프로젝트에 참여 완료 했습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '프로젝트에 참여 하실 수 없습니다.',
  })
  async addProjectPerson(@Param('projectId') projectId, @Req() req) {
    return await this.projectsService.addProjectPerson(
      projectId,
      req.user.user,
    );
  }
}
