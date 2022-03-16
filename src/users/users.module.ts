import { UserInfo, UserInfoSchema } from './../schemas/UserInfo.schema';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Dev, DevSchema } from 'src/schemas/Dev.schema';
import { Design, DesignSchema } from 'src/schemas/Design.schema';
import { User, UserSchema } from 'src/schemas/User.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Dev.name, schema: DevSchema },
      { name: Design.name, schema: DesignSchema },
      { name: UserInfo.name, schema: UserInfoSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
