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

@WebSocketGateway({
  namespace: 'tttt',
  cors: {
    origin: [
      'http://localhost:3000',
      'http://teamingdeploy.s3-website.ap-northeast-2.amazonaws.com',
    ],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
})
export class DmChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('chatting');

  constructor(
    @InjectModel(DmList.name) private readonly dmListModel: Model<DmList>,
    @InjectModel(DmContent.name)
    private readonly dmContentModel: Model<DmContent>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
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

  @SubscribeMessage('join')
  async handleMessage(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    await this.dmListModel.create({ roomName: data.room });
    await this.userModel.findOneAndUpdate(
      { nickname: data.name },
      {
        $push: { dmRooms: 'data.room' },
      },
    );
    await this.userModel.findOneAndUpdate(
      { nickname: data.name },
      {
        $push: { dmRooms: data.room },
      },
    );

    socket.join(data.room);
    socket.emit('message', {
      user: 'admin',
      text: `${data.name}, ${data.room}에 오신걸 환영합니다.`,
    });

    socket.broadcast.to(data.room).emit('message', {
      user: 'admin',
      text: `${data.name} 님이 가입하셨습니다.`,
    });

    socket.to(data.room).emit('roomData', {
      room: 'data.room',
      users: `참가한 방의 유저들 정보`,
    });
  }

  @SubscribeMessage('sendMessage')
  async handleJoinMessage(
    @MessageBody() data: { sender: string; room: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const dmRoom = await this.dmListModel.findOne({ roomName: data.room });
    await this.dmContentModel.create({
      dmList: dmRoom,
      senderNickname: data.sender,
      contents: data.message,
    });

    socket.broadcast.to(data.room).emit('message', {
      sender: data.sender,
      text: data.message,
      createdAt: new Date(),
    });
  }
}
