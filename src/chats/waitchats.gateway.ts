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
    origin: [
      'http://localhost:3000',
      'http://teamingdeploy.s3-website.ap-northeast-2.amazonaws.com',
    ],
  },
  credentials: true,
})
export class WaitchatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('waitroom chatting');

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    this.logger.log('constructor');
  }

  afterInit() {
    this.logger.log('init');
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('waitroom 접속 해제 ');
    this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name}`);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('waitroom 네임스페이스 접속');
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(data.room);

    // 메시지를 전송한 클라이언트에게만 메시지를 전송한다.
    socket.emit('message', {
      user: 'admin',
      text: `${data.name}, ${data.room}에 오신걸 환영합니다.`,
    });

    // 메시지를 전송한 클라이언트를 제외한 room안의 모든 클라이언트에게 메시지를 전송한다.
    socket.broadcast.to(data.room).emit('message', {
      user: 'admin',
      text: `${data.name} 님이 가입하셨습니다.`,
    });

    // to all clients in room except the sender
    socket.to(data.room).emit('roomData', {
      room: data.room,
      users: `참가한 방의 유저들 정보`,
    });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(data.room);

    // 메시지를 전송한 클라이언트를 제외한 room안의 모든 클라이언트에게 메시지를 전송한다.
    socket.broadcast.to(data.room).emit('message', {
      user: 'admin',
      text: `${data.name} 님이 방을 나갔습니다.`,
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { sender: string; room: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.to(data.room).emit('message', {
      sender: data.sender,
      text: data.message,
      date: new Date().toTimeString().split('T')[0],
    });
  }
}
