import { DmListSchema, DmList } from '../schemas/DmList.schema';
import { DmContent, DmContentSchema } from '../schemas/DmContent.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsGateway } from './chats.gateway';
import { User, UserSchema } from '../schemas/User.schema';
import { WaitchatsGateway } from './waitchats.gateway';
import { Chat, ChatSchema } from 'src/schemas/Chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DmList.name, schema: DmListSchema },
      { name: DmContent.name, schema: DmContentSchema },
      { name: User.name, schema: UserSchema },
      { name: Chat.name, schema: ChatSchema },
    ]),
  ],
  providers: [ChatsGateway, WaitchatsGateway],
})
export class ChatsModule {}
