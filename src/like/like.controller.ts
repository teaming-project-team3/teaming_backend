import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LikeService } from './like.service';

@Controller('like')
@ApiTags('Like API')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({
    summary: '좋아요 API',
    description: '좋아요',
  })
  @ApiParam({
    name: 'boardId',
    required: true,
    description: 'boards의 _id',
  })
  @Post(':boardId')
  @UseGuards(AuthGuard())
  plusLike(@Req() req, @Param('boardId') boardId) {
    const user = req.user.user;
    return this.likeService.plusLike(user, boardId);
  }
}
