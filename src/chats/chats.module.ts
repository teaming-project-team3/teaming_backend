import { DmListSchema, DmList } from './../schemas/dmlists.schema';
import { DmContent, DmContentSchema } from './../schemas/dmContents.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsGateway } from './chats.gateway';
import { User, UserSchema } from './../schemas/user.schema';
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
