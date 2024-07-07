import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoomRepository } from './repository/room.repository';
import { uuid } from 'uuidv4';

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

  createRoom(roomName: string) {
    return this.roomRepository.save({
      name: roomName,
      id: uuid(),
    });
  }

  joinRoom(roomName: string, userId: string): boolean {
    let room = this.getRoomByName(roomName);

    if (!room) {
      room = this.createRoom(roomName);
    }

    // 당사자가 방에 참여하기 전의 입장자 수를 세기 때문에 >= 기호를 써야 함
    if (room.getParticipantCount() >= 3) {
      console.log('방이 꽉 찼습니다.');
      return false;
    }

    room.join(userId);

    const user = this.getUser(userId);
    user.joinRoom(roomName);

    return true;
  }

  leaveRoom(roomName: string, userId: string): boolean {
    const room = this.getRoomByName(roomName);

    if (!room) {
      return false;
    }

    if (!room.isParticipant(userId)) {
      return false;
    }

    room.leave(userId);

    const user = this.getUser(userId);
    user.leaveRoom(roomName);

    return true;
  }

  getRoomUsers(roomName: string): string[] {
    const room = this.getRoomByName(roomName);

    if (!room) {
      return [];
    }

    return Array.from(room.getParticipants());
  }

  getRooms(): string[] {
    return this.roomRepository.getAllRoomNames();
  }

  getRoomByName(roomName: string) {
    return this.roomRepository.findByName(roomName);
  }

  getUser(userId: string) {
    return this.userService.findUser(userId);
  }

  getUserIdByNickname(nickname: string): string {
    return this.userService.findUserIdByNickname(nickname);
  }

  getRoomCapacity(roomName: string): number {
    const room = this.getRoomByName(roomName);

    if (!room) {
      return 0;
    }

    return room.getParticipantCount();
  }
}
