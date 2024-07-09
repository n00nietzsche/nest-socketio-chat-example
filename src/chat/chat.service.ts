import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  private server: Server;

  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  notify(message: string, room: string) {
    this.server.to(room).emit('notify', {
      room,
      message,
      sender: '관리자',
    });
  }

  sendNotifyToUser(message: string, userId: string) {
    this.server.to(userId).emit('notify', {
      room: '',
      message,
      sender: '관리자',
      state: 'FULL',
    });
  }

  notifyParticipantCount(room: string) {
    const users = this.roomService.getRoomUsers(room);
    this.notify(`현재 ${users.length}명이 이 방에 있습니다.`, room);
  }

  kickUser(userId: string) {
    const user = this.userService.getUser(userId);
    const client = this.server.sockets.sockets.get(userId);

    if (client) {
      user.joiningRooms.forEach((room) => {
        this.notify(`"${user.nickname}" 님이 강퇴당했습니다.`, room);
      });

      client.disconnect(true);
    }
  }
}
