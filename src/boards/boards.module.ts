import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Board, BoardSchema } from 'src/schemas/Board.schema';
import { Design, DesignSchema } from 'src/schemas/Design.schema';
import { Dev, DevSchema } from 'src/schemas/Dev.schema';
import { Like, LikeSchema } from 'src/schemas/Like.schema';
import { Project, ProjectSchema } from 'src/schemas/Project.schema';
import { User, UserSchema } from 'src/schemas/User.schema';
import { WaitRoom, WaitRoomSchema } from 'src/schemas/WaitRoom.schema';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: User.name, schema: UserSchema },
      { name: WaitRoom.name, schema: WaitRoomSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Design.name, schema: DesignSchema },
      { name: Dev.name, schema: DevSchema },
      { name: Like.name, schema: LikeSchema },
      { name: WaitRoom.name, schema: WaitRoomSchema },
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
