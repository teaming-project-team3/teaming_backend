import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { LikeService } from './like.service';

@Controller('like')
@ApiTags('Like API')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':boardId')
  @UseGuards(AuthGuard())
  plusLike(@Req() req, @Param('boardId') boardId) {
    const user = req.user.user;
    return this.likeService.plusLike(user, boardId);
  }
}
