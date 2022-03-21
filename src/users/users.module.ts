import { UserInfo, UserInfoSchema } from './../schemas/UserInfo.schema';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { PortfolioScrap } from './scrap/portfolio.scrap';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserInfo.name, schema: UserInfoSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, PortfolioScrap],
})
export class UsersModule {}
