import { RoomModel } from '../model/room.model';

export class RoomRepository {
  private rooms: Map<string, RoomModel> = new Map();
  private roomKey: number = 0;

  getAllRoomNames() {
    const roomNames: string[] = [];

    this.rooms.forEach((room) => {
      roomNames.push(room.name);
    });

    return roomNames;
  }

  find(id: string) {
    return this.rooms.get(id);
  }

  findByName(name: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, room] of this.rooms) {
      if (room.name === name) {
        return room;
      }
    }

    return null;
  }

  save({ name }: { name: string }) {
    const id = String(this.roomKey++);

    if (this.rooms.has(id)) {
      throw new Error('이미 존재하는 Room ID 입니다.');
    }

    this.rooms.set(id, new RoomModel(id, name));
    return this.rooms.get(id);
  }

  delete(id: string) {
    return this.rooms.delete(id);
  }
}
