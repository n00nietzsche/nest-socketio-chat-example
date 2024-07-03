import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

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

    this.chatService.enterUser(client.id, nickname);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    this.chatService.leaveUser(client.id);
  }

  // ws://localhost:3000 로 연결 후 `message` 이벤트를 전송하면 payload 가 들어옴
  @SubscribeMessage('message')
  handleMessage(
    client: Socket,
    payload: { room: string; message: string },
  ): void {
    console.log('Received payload:', payload);

    this.server.to(payload.room).emit('message', {
      room: payload.room,
      message: payload.message,
      sender: this.chatService.getUserNickname(client.id),
    });

    console.log(`Message sent to room ${payload.room}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { room: string }): void {
    const { room } = payload;
    const joined = this.chatService.joinRoom(room, client.id);

    if (joined) {
      client.join(room);
      client.emit('joinRoom', room);

      const users = this.chatService.getRoomUsers(room);
      const nickname = this.chatService.getUserNickname(client.id);

      this.sendNotify(
        `"${nickname}" 님이 "${room}" 방에 입장하셨습니다.`,
        room,
      );
      this.sendNotify(`현재 ${users.length}명이 이 방에 있습니다.`, room);
      return;
    }

    console.log(`${client.id} failed to join a room: ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, payload: { room: string }): void {
    const { room } = payload;
    const left = this.chatService.leaveRoom(room, client.id);

    if (left) {
      client.leave(room);
      client.emit('leaveRoom', room);

      const users = this.chatService.getRoomUsers(room);
      const nickname = this.chatService.getUserNickname(client.id);

      this.sendNotify(
        `"${nickname}" 님이 "${room}" 방에서 퇴장하셨습니다.`,
        room,
      );
      this.sendNotify(`현재 ${users.length}명이 이 방에 있습니다.`, room);
      return;
    }

    console.log(`${client.id} failed to leave a room: ${room}`);
  }

  sendNotify(message: string, room: string) {
    this.server.to(room).emit('notify', {
      room,
      message,
      sender: '관리자',
    });
  }
}
