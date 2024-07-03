import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [ChatGateway, ChatService, UserService],
})
export class ChatModule {}
