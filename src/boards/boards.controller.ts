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
  @Get('test')
  i() {
    return this.boardsService.findUser();
  }
  // 메인
  @Get()
  @UseGuards(AuthGuard())
  getAllBoard(@Req() req) {
    console.log(req.user);
    return this.boardsService.getAllBoards(req.user);
  }

  // 프로젝트 등록
  @Post()
  @UseGuards(AuthGuard())
  createBoard(@Req() req, @Body() board: createBoardDto) {
    // console.log('createBoard:', req);
    return this.boardsService.createBoard(board, req.user);
  }

  // 더보기
  @Get(':category')
  getBoard(@Param('category') category: string) {
    return this.boardsService.getAllCategory(category);
  }

  // 프로젝트 삭제
  @Delete(':boardID')
  @UseGuards(AuthGuard())
  deleteBoard(@Req() req, @Param('boardId') boardId: string) {
    return this.boardsService.deleteBoard(boardId, req.user);
  }

  // 임시 회원가입 구현 실사용 x
  @Post('users')
  test(@Body() u: any) {
    return this.boardsService.user(u);
  }
}
