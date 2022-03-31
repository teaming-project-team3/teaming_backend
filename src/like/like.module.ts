import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Board, BoardSchema } from 'src/schemas/Board.schema';
import { Like, LikeSchema } from 'src/schemas/Like.schema';
import { User, UserSchema } from 'src/schemas/User.schema';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: User.name, schema: UserSchema },
      { name: Board.name, schema: BoardSchema },
    ]),
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
