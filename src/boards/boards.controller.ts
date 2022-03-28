import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardsService } from './boards.service';
import { createBoardDto } from './dto/createBoard.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}
  // 메인
  @Get()
  getAllBoard() {
    return this.boardsService.getAllBoards();
  }

  // 프로젝트 등록
  @Post()
  @UseGuards(AuthGuard())
  createBoard(@Req() req, @Body() board: createBoardDto) {
    console.log('createBoard:', req.user.user);
    return this.boardsService.createBoard(board, req.user.user);
  }

  // 보드 상세보기 모달
  @Get(':boardId')
  getModelBoard(@Param('boardId') id: string) {
    return this.boardsService.getModelBoard(id);
  }

  // 더보기
  @Get('category/:category/:page')
  getBoard(@Param('category') category: string, @Param('page') page: number) {
    if (page === 1) {
      page = 0;
    }
    return this.boardsService.getAllCategory(category, page);
  }

  // @Get('mates/:boardId')
  // getModelUser(@Param('boardId') id: string) {
  //   return this.boardsService.getModelUser(id);
  // }

  // 프로젝트 삭제
  @Delete(':boardID')
  @UseGuards(AuthGuard())
  deleteBoard(@Req() req, @Param('boardId') boardId: string) {
    return this.boardsService.deleteBoard(boardId, req.user);
  }
}
