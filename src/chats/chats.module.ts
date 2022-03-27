import { DmListSchema, DmList } from '../schemas/DmLists.schema';
import { DmContent, DmContentSchema } from '../schemas/DmContents.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsGateway } from './chats.gateway';
import { User, UserSchema } from '../schemas/User.schema';
import { WaitchatsGateway } from './waitchats.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DmList.name, schema: DmListSchema },
      { name: DmContent.name, schema: DmContentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ChatsGateway, WaitchatsGateway],
})
export class ChatsModule {}
