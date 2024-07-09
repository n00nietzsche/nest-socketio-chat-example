import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoomRepository } from './repository/room.repository';

@Injectable()
export class RoomService {
  constructor(private userService: UserService) {} // UserService 를 주입받는다.

  private roomRepository = new RoomRepository();

  /**
   * 사용자를 참여중인 모든 방에서 퇴장시킨다.
   * @param userId 퇴장 시킬 사용자 ID
   * @returns 퇴장한 방 목록
   */
  leaveUser(userId: string): string[] {
    const user = this.userService.getUser(userId);
    const leftRooms = [...user.joiningRooms];

    // 사용자가 참여 중인 모든 방에서 나간다.
    user.joiningRooms.forEach((room) => {
      this.leaveRoom(room, userId);
    });

    return leftRooms;
  }

  /**
   * 방을 생성한다.
   * @param roomName 방 이름
   * @returns 만든 방 객체 (RoomModel)
   */
  createRoom(roomName: string) {
    return this.roomRepository.save({
      name: roomName,
    });
  }

  /**
   * 방에 참여한다.
   * @param roomName 방 이름
   * @param userId 참여 사용자 ID
   * @returns 참여 성공 여부
   */
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

    const user = this.userService.getUser(userId);
    user.joinRoom(roomName);

    return true;
  }

  /**
   * 방에서 퇴장한다.
   * @param roomName 방 이름
   * @param userId 퇴장 사용자 ID
   * @returns 퇴장 성공 여부
   */
  leaveRoom(roomName: string, userId: string): boolean {
    const room = this.getRoomByName(roomName);

    if (!room) {
      return false;
    }

    if (!room.isParticipant(userId)) {
      return false;
    }

    room.leave(userId);

    const user = this.userService.getUser(userId);
    user.leaveRoom(roomName);

    return true;
  }

  /**
   * 방에 있는 사용자를 반환한다.
   * @param roomName 방 이름
   * @returns 방에 있는 사용자 ID 목록
   */
  getRoomUsers(roomName: string): string[] {
    const room = this.getRoomByName(roomName);

    if (!room) {
      return [];
    }

    return Array.from(room.getParticipants());
  }

  /**
   * 모든 방 이름을 반환한다.
   * @returns 모든 방 이름 목록
   */
  getRooms(): string[] {
    return this.roomRepository.getAllRoomNames();
  }

  /**
   * 방 이름으로 방을 찾는다.
   * @param roomName 방 이름
   * @returns 방 객체 (RoomModel)
   */
  getRoomByName(roomName: string) {
    return this.roomRepository.findByName(roomName);
  }

  /**
   * 방의 현재 인원을 반환한다.
   * @param roomName 방 이름
   * @returns 방의 현재 인원
   */
  getRoomCapacity(roomName: string): number {
    const room = this.getRoomByName(roomName);

    if (!room) {
      return 0;
    }

    return room.getParticipantCount();
  }
}
