import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createUser() 메서드는 올바른 ID 와 닉네임을 입력받아 사용자를 생성할 수 있다.', () => {
    const createdUser = service.createUser('n00nietzsche', 'Jake');

    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBe('n00nietzsche');
    expect(createdUser.nickname).toBe('Jake');
  });

  it('findUser() 메서드는 올바른 ID 를 입력받아 생성된 사용자를 불러올 수 있다.', () => {
    service.createUser('n00nietzsche', 'Jake');
    const foundUser = service.findUser('n00nietzsche');

    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBe('n00nietzsche');
    expect(foundUser.nickname).toBe('Jake');
  });

  it('deleteUser() 메서드는 생성된 ID 를 입력받아 생성된 사용자를 삭제할 수 있다.', () => {
    const createdUser = service.createUser('n00nietzsche', 'Jake');

    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBe('n00nietzsche');
    expect(createdUser.nickname).toBe('Jake');

    service.deleteUser('n00nietzsche');

    expect(service.findUser('n00nietzsche')).toBeUndefined();
  });

  it('createUser() 메서드는 ID가 없을 경우 에러를 발생시킨다.', () => {
    expect(() => service.createUser('', 'Jake')).toThrow('ID 를 입력해주세요.');
  });

  it('createUser() 메서드는 닉네임이 없을 경우 에러를 발생시킨다.', () => {
    expect(() => service.createUser('n00nietzsche', '')).toThrow(
      '닉네임을 입력해주세요.',
    );
  });

  it('findUser() 메서드는 ID가 없을 경우 에러를 발생시킨다.', () => {
    expect(() => service.findUser('')).toThrow('ID 를 입력해주세요.');
  });

  it('deleteUser() 메서드는 ID가 없을 경우 에러를 발생시킨다.', () => {
    expect(() => service.deleteUser('')).toThrow('ID 를 입력해주세요.');
  });

  it('deleteUser() 메서드는 존재하지 않는 사용자 ID를 입력받았을 경우 에러를 발생시킨다.', () => {
    expect(() => service.deleteUser('nonexistent')).toThrow(
      '사용자를 찾을 수 없습니다.',
    );
  });
});
