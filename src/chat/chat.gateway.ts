import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { MessageDto } from './dto/message.dto';
import { JoinChatDto } from './dto/join-chat.dto';
import { KickUserDto } from './dto/kick-user.dto';
import { ChatService } from './chat.service';
import { LeaveChatDto } from './dto/leave-chat.dto';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  afterInit(server: Server) {
    this.chatService.setServer(server);
  }

  handleConnection(client: Socket) {
    const { nickname } = client.handshake.query;

    if (!nickname || typeof nickname !== 'string') {
      client.disconnect();
      return;
    }

    this.userService.createUser(client.id, nickname);
  }

  handleDisconnect(client: Socket) {
    this.chatService.cleanClient(client);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, messageDto: MessageDto): void {
    this.chatService.sendMessage(client, messageDto);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, joinChatDto: JoinChatDto): void {
    this.chatService.joinRoom(client, joinChatDto);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(client: Socket, leaveChatDto: LeaveChatDto): void {
    this.chatService.leaveRoom(client, leaveChatDto);
  }

  @SubscribeMessage('kickUser')
  handleKickUser(client: Socket, kickUserDto: KickUserDto): void {
    this.chatService.kickUser(kickUserDto);
  }
}
