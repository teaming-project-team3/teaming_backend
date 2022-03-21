import { Logger } from '@nestjs/common';
import { DmContent } from '../schemas/DmContent.schema';
import { DmList } from '../schemas/DmList.schema';
import { Model } from 'mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Socket, Server } from 'socket.io';
import { User } from 'src/schemas/User.schema';

// 대기방 채팅
@WebSocketGateway({
  namespace: 'waitroom',
  cors: {
    origin: '*',
  },
})
export class WaitchatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chatting');

  constructor(
    @InjectModel(DmList.name) private readonly dmListModel: Model<DmList>,
    @InjectModel(DmContent.name)
    private readonly dmContentModel: Model<DmContent>,
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
  ) {
    this.logger.log('constructor');
  }

  afterInit() {
    this.logger.log('init');
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name}`);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody()
    message: { sender: string; room: string; message: string },
    @ConnectedSocket() socket: Socket,
  ): any {
    socket.to(message.room).emit('sendMessage', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinMessage(
    @MessageBody() userInfo,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(userInfo.room);
    socket.emit('joinedRoom', userInfo.room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveMessage(
    @MessageBody() userInfo,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(userInfo.room);
    socket.emit('leftRoom', userInfo.room);
  }
}
