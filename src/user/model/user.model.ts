export class UserModel {
  id: string;
  nickname: string;
  joiningRooms: string[];

  constructor(id: string, nickname: string) {
    this.id = id;
    this.nickname = nickname;
    this.joiningRooms = [];
  }

  updateNickname(nickname: string): boolean {
    if (!nickname) {
      throw new Error('닉네임을 입력해주세요.');
    }

    this.nickname = nickname;
    return true;
  }

  joinRoom(room: string): boolean {
    if (!room) {
      throw new Error('방 이름을 입력해주세요.');
    }

    if (this.joiningRooms.includes(room)) {
      throw new Error('이미 참여 중인 방입니다.');
    }

    this.joiningRooms.push(room);
    return true;
  }

  leaveRoom(room: string): boolean {
    if (!room) {
      throw new Error('방 이름을 입력해주세요.');
    }

    const index = this.joiningRooms.indexOf(room);
    if (index === -1) {
      throw new Error('참여 중인 방이 아닙니다.');
    }

    this.joiningRooms.splice(index, 1);
    return true;
  }
}
