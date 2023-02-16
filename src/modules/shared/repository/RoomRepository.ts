import db from '../../../boot/RedisClient';
import { User } from '../../../types';
import { UserRepository } from './UserRepository';

export class RoomRepository {
  public constructor(private userRepository: UserRepository) {}

  public async addUser(user: User) {
    db.sadd(`room:${user.roomId}`, user.userId);
  }

  public async getUsers(roomId: string) {
    const userIds = await db.smembers(`room:${roomId}`);
    return this.userRepository.findAllIn(userIds);
  }
}
