import { Logger } from '@nestjs/common';
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
import { Chat } from 'src/schemas/Chat.schema';

// 대기방 채팅
@WebSocketGateway({
  namespace: 'waitroom',
  cors: {
    origin: [
      'http://localhost:3000',
      'http://teamingdeploy.s3-website.ap-northeast-2.amazonaws.com',
      'https://wonjinlee.shop',
    ],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
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
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
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
    @MessageBody() data: { name: string; room: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    // 임시 DB연산 ====================================
    console.log('✅========== waitroom join==========✅');
    console.log(data);
    const roomExists = await this.chatModel.findOne({
      projectId: data.room,
    });

    if (!roomExists) {
      // room DB에 저장
      await this.chatModel.create({
        projectId: data.room,
      });
    }
    //db에 참가한 유저 추가
    await this.userModel.findOneAndUpdate(
      { projectId: data.room },
      {
        $push: { participantList: data.name },
      },
    );
    // ====================================
    const roomData = await this.chatModel.findOne({
      projectId: data.room,
    });
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
      users: roomData.participantList,
    });

    console.log('✅===============================✅');
    console.log('socket : ', socket);
    console.log('✅===============================✅');
  }

  @SubscribeMessage('disconnecting')
  async handleLeaveRoom(
    @MessageBody() data: { name: string; room: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('✅==========disconnecting==========✅');

    const { participantList } = await this.chatModel.findOne({
      projectId: data.room,
    });

    //떠난 유저 제거한 배열로 DB에 Update
    const deleteUser = participantList.filter((user) => user !== data.name);
    await this.userModel.findOneAndUpdate(
      { projectId: data.room },
      {
        $set: { participantList: deleteUser },
      },
    );

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
    console.log('✅==========sendMessage==========✅');

    console.log('data : ', data);

    const payload = {
      sender: data.sender,
      text: data.message,
      date: new Date().toTimeString(),
    };

    await this.userModel.findOneAndUpdate(
      { projectId: data.room },
      {
        $push: { messageData: payload },
      },
    );

    socket.broadcast.to(data.room).emit('message', payload);
  }
}
