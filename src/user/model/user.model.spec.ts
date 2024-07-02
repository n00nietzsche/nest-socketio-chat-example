import { UserModel } from './user.model';

describe('UserModel', () => {
  let testUser;

  beforeEach(() => {
    testUser = new UserModel('n00nietzsche', 'Jake');
  });

  it('should be defined', () => {
    expect(testUser).toBeDefined();
  });

  it('User 는 ID 를 갖는다.', () => {
    expect(testUser.id).toBe('n00nietzsche');
  });

  it('User 는 닉네임을 갖는다.', () => {
    expect(testUser.nickname).toBe('Jake');
  });

  it('User 는 updateNickname 메서드를 통해 닉네임을 변경할 수 있다.', () => {
    testUser.updateNickname('John');
    expect(testUser.nickname).toBe('John');
  });

  it('updateNickname() 메서드는 빈 닉네임을 입력받으면 에러를 발생시킨다.', () => {
    expect(() => testUser.updateNickname('')).toThrow('닉네임을 입력해주세요.');
  });

  it('joinRoom() 메서드는 새로운 방에 참여한다.', () => {
    const roomName = 'Room1';
    expect(testUser.joinRoom(roomName)).toBe(true);
    expect(testUser.joiningRooms.includes(roomName)).toBe(true);
  });

  it('joinRoom() 메서드는 빈 방 이름을 입력받으면 에러를 발생시킨다.', () => {
    expect(() => testUser.joinRoom('')).toThrow('방 이름을 입력해주세요.');
  });

  it('joinRoom() 메서드는 이미 참여 중인 방에 다시 참여하려고 하면 에러를 발생시킨다.', () => {
    const roomName = 'Room1';
    testUser.joinRoom(roomName);
    expect(() => testUser.joinRoom(roomName)).toThrow(
      '이미 참여 중인 방입니다.',
    );
  });

  it('leaveRoom() 메서드는 참여 중인 방을 떠난다.', () => {
    const roomName = 'Room1';
    testUser.joinRoom(roomName);
    expect(testUser.leaveRoom(roomName)).toBe(true);
    expect(testUser.joiningRooms.includes(roomName)).toBe(false);
  });

  it('leaveRoom() 메서드는 빈 방 이름을 입력받으면 에러를 발생시킨다.', () => {
    expect(() => testUser.leaveRoom('')).toThrow('방 이름을 입력해주세요.');
  });

  it('leaveRoom() 메서드는 참여 중이지 않은 방을 떠나려고 하면 에러를 발생시킨다.', () => {
    expect(() => testUser.leaveRoom('NonexistentRoom')).toThrow(
      '참여 중인 방이 아닙니다.',
    );
  });
});
