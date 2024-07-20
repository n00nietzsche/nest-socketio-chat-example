import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';
import { ChatService } from './chat.service';
import { chatProviders } from './provider/chat.providers';
import { DatabaseModule } from 'src/_database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    ChatGateway,
    RoomService,
    UserService,
    ChatService,
    ...chatProviders,
  ],
})
export class ChatModule {}
