import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Board, BoardSchema } from 'src/schemas/Board.schema';
import { Project, ProjectSchema } from 'src/schemas/Project.schema';
import { User, UserSchema } from 'src/schemas/User.schema';
import { UserInfo, UserInfoSchema } from 'src/schemas/UserInfo.schema';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: UserInfo.name, schema: UserInfoSchema },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
