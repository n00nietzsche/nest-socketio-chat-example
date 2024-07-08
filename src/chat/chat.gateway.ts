import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { MessageDto } from './dto/message.dto';
import { JoinChatDto } from './dto/join-chat.dto';
import { KickUserDto } from './dto/kick-user.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    console.log('클라이언트로 부터 전달받은 데이터', client.handshake.query);

    const { nickname } = client.handshake.query;

    // nickname 이 입력되지 않았다면 연결을 끊는다.
    if (!nickname) {
      client.disconnect();
      return;
    }

    // nickname 이 문자열이 아니면 연결을 끊는다.
    if (typeof nickname !== 'string') {
      client.disconnect();
      return;
    }

    this.userService.createUser(client.id, nickname);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const { nickname } = this.userService.getUser(client.id);
    const leftRooms = this.roomService.leaveUser(client.id);

    leftRooms.forEach((room) => {
      this.notify(`"${nickname}" 님이 퇴장하셨습니다.`, room);
      this.notifyParticipantCount(room);
    });
  }

  // ws://localhost:3000 로 연결 후 `message` 이벤트를 전송하면 payload 가 들어옴
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: MessageDto): void {
    // TODO: 페이로드 보고 룸 이름으로 받는지 아이디로 받는지 확인해보기
    console.log('Received payload:', payload);

    this.server.to(payload.room).emit('message', {
      room: payload.room,
      message: payload.message,
      sender: this.userService.getUser(client.id).nickname,
    });

    console.log(`Message sent to room ${payload.room}`);
  }

  @SubscribeMessage('joinChat')
  handleJoinRoom(client: Socket, payload: JoinChatDto): void {
    const { room } = payload;
    const joined = this.roomService.joinRoom(room, client.id);

    if (joined) {
      client.join(room);
      client.emit('joinChat', room);

      const { nickname } = this.userService.getUser(client.id);

      this.notify(`"${nickname}" 님이 "${room}" 방에 입장하셨습니다.`, room);

      this.notifyParticipantCount(room);
      return;
    }

    this.sendNotifyToUser('방이 꽉 찼습니다.', client.id);
    client.disconnect();
  }

  @SubscribeMessage('leaveChat')
  handleLeaveRoom(client: Socket, payload: { room: string }): void {
    const { room } = payload;
    const left = this.roomService.leaveRoom(room, client.id);

    if (left) {
      client.leave(room);
      client.emit('leaveChat', room);

      const { nickname } = this.userService.getUser(client.id);

      this.notify(`"${nickname}" 님이 "${room}" 방에서 퇴장하셨습니다.`, room);

      this.notifyParticipantCount(room);
      return;
    }

    console.log(`${client.id} failed to leave a room: ${room}`);
  }

  @SubscribeMessage('kickUser')
  handleKickUser(client: Socket, payload: KickUserDto): void {
    const { nickname } = payload;
    const userId = this.userService.getUserIdByNickname(nickname);

    this.kickUser(userId);
  }

  notify(message: string, room: string) {
    this.server.to(room).emit('notify', {
      room,
      message,
      sender: '관리자',
    });
  }

  sendNotifyToUser(message: string, userId: string) {
    this.server.to(userId).emit('notify', {
      room: '',
      message,
      sender: '관리자',
      state: 'FULL',
    });
  }

  notifyParticipantCount(room: string) {
    const users = this.roomService.getRoomUsers(room);
    this.notify(`현재 ${users.length}명이 이 방에 있습니다.`, room);
  }

  kickUser(userId: string) {
    const user = this.userService.getUser(userId);
    const client = this.server.sockets.sockets.get(userId);

    if (client) {
      user.joiningRooms.forEach((room) => {
        this.notify(`"${user.nickname}" 님이 강퇴당했습니다.`, room);
      });

      client.disconnect(true);
    }
  }
}
