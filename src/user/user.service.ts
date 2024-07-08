import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  private userRepository = new UserRepository();

  createUser(id: string, nickname: string) {
    if (!id) {
      throw new Error('ID 를 입력해주세요.');
    }

    if (!nickname) {
      throw new Error('닉네임을 입력해주세요.');
    }

    return this.userRepository.createUser(id, nickname);
  }

  getUser(id: string) {
    if (!id) {
      throw new Error('ID 를 입력해주세요.');
    }

    return this.userRepository.findUser(id);
  }

  removeUser(id: string) {
    if (!id) {
      throw new Error('ID 를 입력해주세요.');
    }

    const foundUser = this.userRepository.findUser(id);

    if (!foundUser) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return this.userRepository.deleteUser(id);
  }

  getUserIdByNickname(nickname: string) {
    if (!nickname) {
      throw new Error('닉네임을 입력해주세요.');
    }

    return this.userRepository.findUserIdByNickname(nickname);
  }
}
