import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { UserService } from '../user/user.service';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService, UserService],
    }).compile();

    service = module.get<RoomService>(RoomService);

    service.enterUser('user1', 'user1');
    service.enterUser('user2', 'user2');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('joinRoom 메서드를 통해 이용자가 방에 들어갈 수 있다.', () => {
    const room = 'room1';
    const userId = 'user1';

    const joinRoomResult = service.joinRoom(room, userId);
    const users = service.getRoomUsers(room);

    expect(joinRoomResult).toBe(true);
    expect(users).toContain(userId);
  });

  it('leaveRoom 메서드를 통해 이용자가 방에서 나갈 수 있다.', () => {
    const room = 'room1';
    const userId = 'user1';

    service.joinRoom(room, userId);
    const leaveRoomResult = service.leaveRoom(room, userId);
    const users = service.getRoomUsers(room);

    expect(leaveRoomResult).toBe(true);
    expect(users).not.toContain(userId);
  });

  it('getRoomUsers 메서드를 통해 방에 있는 이용자 목록을 조회할 수 있다.', () => {
    const room = 'room1';
    const userId1 = 'user1';
    const userId2 = 'user2';

    service.joinRoom(room, userId1);
    service.joinRoom(room, userId2);
    const users = service.getRoomUsers(room);

    expect(users).toContain(userId1);
    expect(users).toContain(userId2);
  });

  it('getRooms 메서드를 통해 방 목록을 조회할 수 있다.', () => {
    const room1 = 'room1';
    const room2 = 'room2';

    service.joinRoom(room1, 'user1');
    service.joinRoom(room2, 'user2');
    const rooms = service.getRooms();

    expect(rooms).toContain(room1);
    expect(rooms).toContain(room2);
  });

  it('getRoomCapacity 메서드를 통해 방의 인원 수를 조회할 수 있다.', () => {
    const room = 'room1';
    const userId1 = 'user1';
    const userId2 = 'user2';

    service.joinRoom(room, userId1);
    service.joinRoom(room, userId2);

    const capacity = service.getRoomCapacity(room);
    expect(capacity).toBe(2);
  });
});
