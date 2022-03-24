import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Board, BoardSchema } from 'src/schemas/Board.schema';
import { UserInfo, UserInfoSchema } from 'src/schemas/UserInfo.schema';
import { Like, LikeSchema } from 'src/schemas/Like.schema';
import { Project, ProjectSchema } from 'src/schemas/Project.schema';
import { User, UserSchema } from 'src/schemas/User.schema';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: User.name, schema: UserSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: UserInfo.name, schema: UserInfoSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SCERTKEY,
      signOptions: {
        expiresIn: 60 * 10000,
      },
    }),
  ],
  exports: [MongooseModule, JwtStrategy, PassportModule],
  controllers: [BoardsController],
  providers: [BoardsService, JwtStrategy],
})
export class BoardsModule {}
