import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  notify(server: Server, message: string, room: string) {
    server.to(room).emit('notify', {
      room,
      message,
      sender: '관리자',
    });
  }

  sendNotifyToUser(server: Server, message: string, userId: string) {
    server.to(userId).emit('notify', {
      room: '',
      message,
      sender: '관리자',
      state: 'FULL',
    });
  }

  notifyParticipantCount(server: Server, room: string) {
    const users = this.roomService.getRoomUsers(room);
    this.notify(server, `현재 ${users.length}명이 이 방에 있습니다.`, room);
  }

  kickUser(server: Server, userId: string) {
    const user = this.userService.getUser(userId);
    const client = server.sockets.sockets.get(userId);

    if (client) {
      user.joiningRooms.forEach((room) => {
        this.notify(server, `"${user.nickname}" 님이 강퇴당했습니다.`, room);
      });

      client.disconnect(true);
    }
  }
}
