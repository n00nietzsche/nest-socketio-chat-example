import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
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

  /**
   * 방에 알림을 보낸다.
   * @param message 보낼 메세지
   */
  notify(message: string, room: string) {
    this.server.to(room).emit('notify', {
      room,
      message,
      sender: '관리자',
    });
  }

  /**
   * 특정 사용자에게 알림을 보낸다.
   * @param message 보낼 메세지
   * @param userId 수신 사용자 ID
   */
  sendNotifyToUser(message: string, userId: string) {
    this.server.to(userId).emit('notify', {
      room: '',
      message,
      sender: '관리자',
      state: 'FULL',
    });
  }

  /**
   * 방에 참여 중인 유저 수를 알린다.
   * @param room 방 이름
   */
  notifyParticipantCount(room: string) {
    const users = this.roomService.getRoomUsers(room);
    this.notify(`현재 ${users.length}명이 이 방에 있습니다.`, room);
  }

  /**
   * 유저가 속했던 모든 방에 강퇴당했음을 알리고, 해당 유저와 연결을 끊는다.
   * @param userId 강퇴할 유저의 ID
   */
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

  /**
   * 클라이언트가 연결을 끊었을 때, 모든 방에 퇴장 알림을 보낸다.
   * @param client 소켓 IO 클라이언트
   */
  notifyDisconnection(client: Socket) {
    const { nickname, joiningRooms } = this.userService.getUser(client.id);

    joiningRooms.forEach((room) => {
      this.notify(`"${nickname}" 님이 퇴장하셨습니다.`, room);
      this.notifyParticipantCount(room);
    });
  }

  /**
   * 클라이언트가 연결을 끊었을 때, 사용자 정보를 삭제한다.
   * @param client 소켓 IO 클라이언트
   */
  cleanClient(client: Socket) {
    const { id } = client;

    this.roomService.leaveUser(id);
    this.userService.removeUser(id);
  }
}
