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
import { LeaveChatDto } from './dto/leave-chat.dto';

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
    this.chatService.notifyDisconnection(client);
    this.chatService.cleanClient(client);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, messageDto: MessageDto): void {
    this.chatService.sendMessage(client, messageDto);
  }

  @SubscribeMessage('joinChat')
  handleJoinRoom(client: Socket, joinChatDto: JoinChatDto): void {
    this.chatService.joinRoom(client, joinChatDto);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveRoom(client: Socket, leaveChatDto: LeaveChatDto): void {
    this.chatService.leaveRoom(client, leaveChatDto);
  }

  @SubscribeMessage('kickUser')
  handleKickUser(client: Socket, payload: KickUserDto): void {
    const { nickname } = payload;
    const userId = this.userService.getUserIdByNickname(nickname);

    this.chatService.kickUser(userId);
  }
}
