import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  // ws://localhost:3000 로 연결 후 `message` 이벤트를 전송하면 payload 가 들어옴
  @SubscribeMessage('message')
  handleMessage(client: any, payload: string): void {
    console.log('payload', payload);
    this.server.emit('message', payload);
  }
}
