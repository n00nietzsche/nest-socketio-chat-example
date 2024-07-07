import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoomRepository } from './repository/room.repository';

@Injectable()
export class RoomService {
  constructor(private userService: UserService) {} // UserService 를 주입받는다.

  private roomRepository = new RoomRepository();

  enterUser(userId: string, nickname: string): void {
    this.userService.createUser(userId, nickname);
  }

  leaveUser(userId: string): string[] {
    const user = this.getUser(userId);
    const leftRooms = [...user.joiningRooms];

    // 사용자가 참여 중인 모든 방에서 나간다.
    user.joiningRooms.forEach((room) => {
      this.leaveRoom(room, userId);
    });

    this.userService.deleteUser(userId);
    return leftRooms;
  }

  getUserNickname(userId: string): string {
    return this.getUser(userId).nickname;
  }

  joinRoom(room: string, userId: string): boolean {
    if (!this.getRoom(room)) {
      this.roomRepository.save(room);
    }

    const occupants = this.getRoom(room);

    // 당사자가 방에 참여하기 전의 입장자 수를 세기 때문에 >= 기호를 써야 함
    if (occupants.size >= 3) {
      console.log('방이 꽉 찼습니다.');
      return false;
    }

    occupants.add(userId);
    const user = this.getUser(userId);
    user.joinRoom(room);

    return true;
  }

  leaveRoom(room: string, userId: string): boolean {
    if (!this.getRoom(room)) {
      return false;
    }

    const occupants = this.getRoom(room);

    if (!occupants.has(userId)) {
      return false;
    }

    occupants.delete(userId);

    const user = this.getUser(userId);
    user.leaveRoom(room);

    return true;
  }

  getRoomUsers(room: string): string[] {
    if (!this.getRoom(room)) {
      return [];
    }

    return Array.from(this.getRoom(room));
  }

  getRooms(): string[] {
    return this.roomRepository.getAllRooms();
  }

  getRoom(room: string) {
    return this.roomRepository.find(room);
  }

  getRoomCapacity(room: string): number {
    if (!this.getRoom(room)) {
      return 0;
    }

    return this.getRoom(room).size;
  }

  getUser(userId: string) {
    return this.userService.findUser(userId);
  }

  getUserIdByNickname(nickname: string): string {
    return this.userService.findUserIdByNickname(nickname);
  }
}
