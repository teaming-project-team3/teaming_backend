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
import { ChatsService } from './chats.service';

@WebSocketGateway({
  namespace: 'webrtc',
  cors: {
    origin: ['https://teaming.link', 'http://localhost:3000'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
})
export class WebrtcGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('webrtc');
  private roomObjArr: any;
  private MAXIMUM: number;

  constructor(private chatService: ChatsService) {
    this.logger.log('constructor');
    this.roomObjArr = [];
    this.MAXIMUM = 6;
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log(`✅=========webrtc Disconnect==============✅`);
    console.log(`✅=========socket['myNickname']==============✅`);
    console.log('this.myRoomName', socket['myRoomName']);
    console.log('this.myNickname', socket['myNickname']);
    console.log(`✅=========socket['myNickname']==============✅`);

    socket.to(socket['myRoomName']).emit('leaveRoom', socket.id);
    socket.leave(socket['myRoomName']);

    let isRoomEmpty = false;
    for (let i = 0; i < this.roomObjArr.length; ++i) {
      if (this.roomObjArr[i].roomName === socket['myRoomName']) {
        const newUsers = this.roomObjArr[i].users.filter(
          (user) => user.socketId != socket.id,
        );
        this.roomObjArr[i].users = newUsers;
        this.roomObjArr[i].currentNum -= 1;

        console.log(`✅=========${socket['myRoomName']}==============✅`);

        console.log(this.roomObjArr[i]);
        console.log(`✅=========${socket['myRoomName']}==============✅`);

        if (this.roomObjArr[i].currentNum == 0) {
          isRoomEmpty = true;
        }
      }
    }

    // Delete room
    if (isRoomEmpty) {
      const newRoomObjArr = this.roomObjArr.filter(
        (roomObj) => roomObj.currentNum != 0,
      );
      this.roomObjArr = newRoomObjArr;
    }

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
  async handleJoinRoom(
    @MessageBody() data: { roomName: string; nickName: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket['myNickname'] = data.nickName;
    socket['myRoomName'] = data.roomName;

    let isRoomExist = false;
    let targetRoomObj: any;

    for (let i = 0; i < this.roomObjArr.length; ++i) {
      if (this.roomObjArr[i].roomName === socket['myRoomName']) {
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
        roomName: socket['myRoomName'],
        currentNum: 0,
        users: [],
      };
      this.roomObjArr.push(targetRoomObj);
    }

    //Join the room
    targetRoomObj.users.push({
      socketId: socket.id,
      nickName: socket['myNickname'],
      video: false,
      audio: false,
    });

    targetRoomObj.currentNum += 1;

    const usersStack = [];
    for (let i = 0; i < targetRoomObj.currentNum; i++) {
      const usersStackObj = await this.chatService.getStackJoinUser(
        targetRoomObj.users[i].nickName,
      );
      usersStackObj['socketId'] = targetRoomObj.users[i].socketId;
      const obj = {
        targetRoomObjUsers: targetRoomObj.users[i],
        usersStackObj,
      };
      usersStack.push(obj);
    }

    socket.emit('accept_join', usersStack);

    console.log('✅=========targetRoomObj.users==============✅');
    console.log(targetRoomObj.users);
    console.log('✅=========targetRoomObj.users==============✅');

    socket.join(socket['myRoomName']);
  }

  @SubscribeMessage('ice')
  handleIce(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    console.log('✅=========ice==============✅');

    socket.to(data.remoteSocketId).emit('ice', data.ice, socket.id);
  }

  @SubscribeMessage('offer')
  async handleOffer(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('✅=========offer============✅');
    const newUserStack = await this.chatService.getStackJoinUser(
      socket['myNickname'],
    );
    newUserStack['socketId'] = socket.id;
    console.log('✅=========newUserStack==============✅');
    console.log(newUserStack);
    console.log('✅=========newUserStack==============✅');

    socket
      .to(data.remoteSocketId)
      .emit('offer', data.offer, socket.id, data.localNickName, newUserStack);
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    console.log('✅=========answer============✅');
    socket.to(data.remoteSocketId).emit('answer', data.answer, socket.id);
  }

  @SubscribeMessage('videoON')
  handleEventVideoOn(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): any {
    console.log('✅========== videoON==========✅');

    const videoStatus = true;

    socket.to(data.roomName).emit('videoON', data.nickName, videoStatus);

    let targetRoomObj: any;

    for (let i = 0; i < this.roomObjArr.length; ++i) {
      if (this.roomObjArr[i].roomName === socket['myRoomName']) {
        targetRoomObj = this.roomObjArr[i];
        break;
      }
    }
    for (let i = 0; i < this.roomObjArr.length; ++i) {
      if (targetRoomObj.users[i] === socket['myNickname']) {
        targetRoomObj.users[i].video = videoStatus;
      }
    }
  }
  @SubscribeMessage('videoOFF')
  handleEventVideoOff(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): any {
    console.log('✅========== videoOFF==========✅');

    const videoStatus = false;
    socket.to(data.roomName).emit('videoOFF', data.nickName, videoStatus);

    let targetRoomObj: any;

    for (let i = 0; i < this.roomObjArr.length; ++i) {
      if (this.roomObjArr[i].roomName === socket['myRoomName']) {
        targetRoomObj = this.roomObjArr[i];
        break;
      }
    }
    for (let i = 0; i < this.roomObjArr.length; ++i) {
      if (targetRoomObj.users[i] === socket['myNickname']) {
        targetRoomObj.users[i].video = videoStatus;
      }
    }
  }
  @SubscribeMessage('audioON')
  handleEventAudioOn(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): any {
    console.log('✅========== audioON==========✅');
    const audioStatus = true;
    socket.to(data.roomName).emit('audioON', data.nickName, audioStatus);

    let targetRoomObj: any;

    for (let i = 0; i < this.roomObjArr.length; ++i) {
      if (this.roomObjArr[i].roomName === socket['myRoomName']) {
        targetRoomObj = this.roomObjArr[i];
        break;
      }
    }
    for (let i = 0; i < this.roomObjArr.length; ++i) {
      if (targetRoomObj.users[i] === socket['myNickname']) {
        targetRoomObj.users[i].audio = audioStatus;
      }
    }
  }
  @SubscribeMessage('audioOFF')
  handleEventAudioOff(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): any {
    console.log('✅========== audioOFF==========✅');
    const audioStatus = false;
    socket.to(data.roomName).emit('audioOFF', data.nickName, audioStatus);

    let targetRoomObj: any;

    for (let i = 0; i < this.roomObjArr.length; ++i) {
      if (this.roomObjArr[i].roomName === socket['myRoomName']) {
        targetRoomObj = this.roomObjArr[i];
        break;
      }
    }
    for (let i = 0; i < this.roomObjArr.length; ++i) {
      if (targetRoomObj.users[i] === socket['myNickname']) {
        targetRoomObj.users[i].audio = audioStatus;
      }
    }
  }
}
