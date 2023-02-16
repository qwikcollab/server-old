import db from '../../../boot/RedisClient';

export interface User {
  name: string;
  email?: string;
  userId: string;
}

export class UserRepository {
  private store: Record<string, User> = {};

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
