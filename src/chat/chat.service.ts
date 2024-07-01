import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private rooms: Map<string, Set<string>> = new Map();
  private readonly MAX_ROOM_CAPACITY = 10; // 최대 인원 수

  joinRoom(room: string, userId: string): boolean {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }

    const users = this.rooms.get(room);
    if (users.size >= this.MAX_ROOM_CAPACITY) {
      return false;
    }

    users.add(userId);
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
}
