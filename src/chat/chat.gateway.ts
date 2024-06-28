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
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
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
      sender: client.id,
    });

    console.log(`Message sent to room ${payload.room}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { room: string }): void {
    const { room } = payload;

    client.join(room);
    client.emit('joinRoom', room);

    console.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, payload: { room: string }): void {
    const { room } = payload;

    client.leave(room);
    client.emit('leaveRoom', room);

    console.log(`Client ${client.id} left room: ${room}`);
  }
}
