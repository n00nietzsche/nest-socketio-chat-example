import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  constructor(private userService: UserService) {} // UserService 를 주입받는다.

  private rooms: Map<string, Set<string>> = new Map();
  private readonly MAX_ROOM_CAPACITY = 3; // 최대 인원 수

  enterUser(userId: string, nickname: string): void {
    this.userService.createUser(userId, nickname);
  }

  leaveUser(userId: string): void {
    // 사용자가 참여 중인 모든 방에서 나간다.
    this.getUser(userId).joiningRooms.forEach((room) => {
      this.leaveRoom(room, userId);
    });

    this.userService.deleteUser(userId);
  }

  getUserNickname(userId: string): string {
    return this.getUser(userId).nickname;
  }

  joinRoom(room: string, userId: string): boolean {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }

    const occupants = this.rooms.get(room);

    // 당사자가 방에 참여하기 전의 입장자 수를 세기 때문에 >= 기호를 써야 함
    if (occupants.size >= this.MAX_ROOM_CAPACITY) {
      console.log('방이 꽉 찼습니다.');
      return false;
    }

    occupants.add(userId);
    return true;
  }

  leaveRoom(room: string, userId: string): boolean {
    if (!this.rooms.has(room)) {
      return false;
    }

    const users = this.rooms.get(room);
    if (!users.has(userId)) {
      return false;
    }

    users.delete(userId);
    return true;
  }

  getRoomUsers(room: string): string[] {
    if (!this.rooms.has(room)) {
      return [];
    }

    return Array.from(this.rooms.get(room));
  }

  getRooms(): string[] {
    return Array.from(this.rooms.keys());
  }

  getRoomCapacity(room: string): number {
    if (!this.rooms.has(room)) {
      return 0;
    }

    return this.rooms.get(room).size;
  }

  getUser(userId: string) {
    return this.userService.findUser(userId);
  }
}
