import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DmChatsGateway } from './dmchats.gateway';
import { User, UserSchema } from '../schemas/User.schema';
import { WaitchatsGateway } from './waitchats.gateway';
import { Chat, ChatSchema } from 'src/schemas/Chat.schema';
import { WebrtcGateway } from './webrtc.gateway';
import { DmChat, DmChatSchema } from 'src/schemas/DmChat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DmChat.name, schema: DmChatSchema },
      { name: User.name, schema: UserSchema },
      { name: Chat.name, schema: ChatSchema },
    ]),
  ],
  providers: [DmChatsGateway, WaitchatsGateway /*,WebrtcGateway*/],
})
export class ChatsModule {}
