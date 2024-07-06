import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, UserService],
})
export class RoomModule {}
