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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { createBoardDto } from './dto/createBoard.dto';
import { updateBoardDto } from './dto/updateBoard.dto';
import { getAllBoard } from './entities/Board.entity';

@Controller('boards')
@ApiTags('Boards API')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}
  // 메인
  @Get()
  @ApiOperation({
    summary: '모든 보드 가져오기',
    description: '보드 카테고리 별로 가져옵니다.',
  })
  @ApiResponse({
    description: '보드 카테고리 별로 가져옵니다.',
    type: getAllBoard,
  })
  getAllBoard() {
    return this.boardsService.getAllBoards();
  }

  // 프로젝트 등록
  @Post()
  @ApiOperation({
    summary: '프로젝트 등록',
    description: '보드와 프로젝트를 하나 생성한다',
  })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '보트와 프로젝트를 하나 생성합니다.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @UseGuards(AuthGuard())
  createBoard(@Req() req, @Body() board: createBoardDto) {
    console.log('유저 정보:', req.user.user);
    return this.boardsService.createBoard(board, req.user.user);
  }

  // 보드 상세보기 모달
  @Get(':boardId')
  @ApiOperation({
    summary: '보드 상세보기',
    description: '',
  })
  @ApiOkResponse({
    description: '보트와 프로젝트를 하나 생성합니다.',
  })
  @ApiUnauthorizedResponse({ description: '' })
  getModelBoard(@Param('boardId') id: string) {
    return this.boardsService.getModelBoard(id);
  }

  // 더보기
  @Get('category/:category/:page')
  @ApiOperation({
    summary: '카테고리 가져오기',
    description: '',
  })
  @ApiOkResponse({
    description: '보드와 프로젝트를 하나 생성합니다.',
  })
  @ApiUnauthorizedResponse({ description: '' })
  getBoard(@Param('category') category: string, @Param('page') page: number) {
    let newPage = --page;
    return this.boardsService.getAllCategory(category, newPage);
  }

  // 프로젝트 수정
  @Put('/:boardId')
  @UseGuards(AuthGuard())
  @ApiOperation({})
  updataBoard(@Param('boardId') boardId, @Body() board: updateBoardDto) {
    console.log('=============프로젝트 수정=============');
    return this.boardsService.updateBoard(boardId, board);
  }

  // 프로젝트 삭제
  @Delete(':boardID')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: '프로젝트 삭제',
    description: '',
  })
  @ApiOkResponse({
    description: '보트와 프로젝트를 하나 생성합니다.',
  })
  @ApiUnauthorizedResponse({ description: '' })
  @UseGuards(AuthGuard())
  deleteBoard(@Req() req, @Param('boardId') boardId: string) {
    return this.boardsService.deleteBoard(boardId, req.user);
  }
}
