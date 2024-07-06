import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';

@Module({
  providers: [ChatGateway, RoomService, UserService],
})
export class ChatModule {}
