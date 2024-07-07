export class RoomRepository {
  private rooms: Map<string, Set<string>> = new Map();

  getAllRooms() {
    return Array.from(this.rooms.keys());
  }

  find(name: string) {
    return this.rooms.get(name);
  }

  save(name: string) {
    if (this.rooms.has(name)) {
      return false;
    }

    this.rooms.set(name, new Set());
    return true;
  }

  delete(name: string) {
    return this.rooms.delete(name);
  }
}
