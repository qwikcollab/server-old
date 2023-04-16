import { User } from '../../types';
import db from '../../boot/RedisClient';
import { injectable } from 'inversify';

export interface ICacheService {
  addUser(user: User): void;
  getUsers(token: string): any;
  find(userId: string): Promise<User | null>;
  findAllIn(userIds: string[]): Promise<User[]>;
}

@injectable()
export class CacheService implements ICacheService {
  private store: Record<string, User> = {};

  public async addUser(user: User) {
    db.sadd(`room:${user.roomId}`, user.userId);
  }

  public async getUsers(roomId: string) {
    const userIds = await db.smembers(`room:${roomId}`);
    return this.findAllIn(userIds);
  }

  public async find(userId: string): Promise<User | null> {
    const user = await db.hget('users', userId);
    if (!user) {
      return null;
    }
    return JSON.parse(user);
  }

  public create(user: User) {
    db.hset('users', user.userId, JSON.stringify(user));
    this.store[user.userId] = user;
    return user;
  }

  public async findAllIn(userIds: string[]): Promise<User[]> {
    const users = await db.hmget('users', ...userIds);
    if (!users) {
      return [];
    }
    return users.filter((u) => u).map((u) => JSON.parse(u as string));
  }
}
