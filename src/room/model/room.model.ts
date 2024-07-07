export class RoomModel {
  id: string;
  name: string;
  participants: string[];

  private readonly MAX_ROOM_CAPACITY = 3; // 최대 인원 수

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.participants = [];
  }

  join(user: string): boolean {
    if (!user) {
      throw new Error('참여자를 입력해주세요.');
    }

    if (this.participants.includes(user)) {
      throw new Error('이미 참여 중인 사용자입니다.');
    }

    this.participants.push(user);
    return true;
  }

  leave(user: string): boolean {
    if (!user) {
      throw new Error('참여자를 입력해주세요.');
    }

    const index = this.participants.indexOf(user);
    if (index === -1) {
      throw new Error('참여 중인 사용자가 아닙니다.');
    }

    this.participants.splice(index, 1);
    return true;
  }

  getParticipants() {
    return this.participants;
  }

  getParticipantCount() {
    return this.participants.length;
  }

  getParticipantCountText() {
    const count = this.getParticipantCount();
    return count > 0 ? `${count}명` : '참여자 없음';
  }

  getParticipantText() {
    return this.participants.join(', ');
  }

  isParticipant(user: string) {
    return this.participants.includes(user);
  }

  isFull() {
    return this.participants.length >= this.MAX_ROOM_CAPACITY;
  }

  isAvailable() {
    return !this.isFull();
  }

  isEmpty() {
    return this.participants.length === 0;
  }
}
