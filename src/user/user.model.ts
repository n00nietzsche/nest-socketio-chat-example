export class UserModel {
  id: string;
  nickname: string;
  joiningRooms: string[];

  constructor(id: string, nickname: string) {
    this.id = id;
    this.nickname = nickname;
    this.joiningRooms = [];
  }
}
