import { Logger } from '@nestjs/common';
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
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'webrtc',
  cors: {
    origin: [
      'https://localhost:3000',
      'https://d1zc5f9ndqmvzc.cloudfront.net/',
      'https://wonjinlee.shop',
      'http://teamingdeploy.s3-website.ap-northeast-2.amazonaws.com',
    ],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
})
export class WebrtcGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('waitroom chatting');
  private roomObjArr: any;
  private MAXIMUM: number;
  private myRoomName;
  private myNickname;

  constructor() {
    this.logger.log('constructor');
    this.roomObjArr = [];
    this.MAXIMUM = 5;
    this.myRoomName = null;
    this.myNickname = null;
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('webrtc 접속 해제 ');
    this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name}`);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('webrtc 네임스페이스 접속');
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }
  afterInit() {
    this.logger.log('init');
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() data: { roomName: string; nickName: string },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('data!!' + data);
    console.log('socket', socket);

    this.myRoomName = data.roomName;
    this.myNickname = data.nickName;

    let isRoomExist = false;
    let targetRoomObj: any;

    for (let i = 0; i < this.roomObjArr.length; ++i) {
      if (this.roomObjArr[i].roomName === data.roomName) {
        // Reject join the room
        if (this.roomObjArr[i].currentNum >= this.MAXIMUM) {
          socket.emit('reject_join');
          return;
        }

        isRoomExist = true;
        targetRoomObj = this.roomObjArr[i];
        break;
      }
    }

    // Create room
    if (!isRoomExist) {
      console.log('createRoom!!');
      targetRoomObj = {
        roomName: data.roomName,
        currentNum: 0,
        users: [],
      };
      this.roomObjArr.push(targetRoomObj);
    }

    //Join the room
    targetRoomObj.users.push({
      socketId: socket.id,
      nickName: data.nickName,
    });

    targetRoomObj.currentNum += 1;

    socket.join(data.roomName);
    console.log("after join, emit 'accept_join'", targetRoomObj.users);

    socket.emit('accept_join', targetRoomObj.users);
    //join_room end
  }

  @SubscribeMessage('ice')
  async handleIce(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    socket.to(data.remoteSocketId).emit('ice', data.ice, socket.id);
  }

  @SubscribeMessage('offer')
  async handleOffer(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket
      .to(data.remoteSocketId)
      .emit('offer', data.offer, socket.id, data.localNickname);
  }

  @SubscribeMessage('answer')
  async handleAnswer(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(data.remoteSocketId).emit('answer', data.answer, socket.id);
  }
}
