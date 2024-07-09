import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  afterInit(server: Server) {
    this.chatService.setServer(server);
  }

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
      this.chatService.notify(`"${nickname}" 님이 퇴장하셨습니다.`, room);

      this.chatService.notifyParticipantCount(room);
    });
  }

  // ws://localhost:3000 로 연결 후 `message` 이벤트를 전송하면 payload 가 들어옴
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: MessageDto): void {
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

      this.chatService.notify(
        `"${nickname}" 님이 "${room}" 방에 입장하셨습니다.`,
        room,
      );

      this.chatService.notifyParticipantCount(room);
      return;
    }

    this.chatService.sendNotifyToUser('방이 꽉 찼습니다.', client.id);

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

      this.chatService.notify(
        `"${nickname}" 님이 "${room}" 방에서 퇴장하셨습니다.`,
        room,
      );

      this.chatService.notifyParticipantCount(room);
      return;
    }

    console.log(`${client.id} failed to leave a room: ${room}`);
  }

  @SubscribeMessage('kickUser')
  handleKickUser(client: Socket, payload: KickUserDto): void {
    const { nickname } = payload;
    const userId = this.userService.getUserIdByNickname(nickname);

    this.chatService.kickUser(userId);
  }
}
