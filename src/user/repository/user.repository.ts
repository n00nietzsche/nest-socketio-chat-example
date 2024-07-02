import { UserModel } from '../model/user.model';

export class UserRepository {
  private users: Map<string, UserModel> = new Map();

  createUser(id: string, nickname: string): UserModel {
    if (this.users.has(id)) {
      return null;
    }

    const user = new UserModel(id, nickname);
    this.users.set(id, user);
    return user;
  }

  findUser(id: string): UserModel {
    return this.users.get(id);
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }
}
