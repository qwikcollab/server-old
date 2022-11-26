import { User } from '../../types';

export class RoomsState {
  private static rooms: { [roomId: string]: User[] } = {};

  public static addUser(user: User) {
    const existingUsers = this.getUsers(user.roomId);
    const alreadyExists = existingUsers.find(
      (u) => u.socketId === user.socketId,
    );
    if (alreadyExists) {
      return;
    }
    existingUsers.push(user);
  }

  public static removeUser(user: User | null) {
    if (!user) {
      return;
    }
    const existingUsers = this.rooms[user.roomId];
    if (!existingUsers) {
      return;
    }
    this.rooms[user.roomId] = existingUsers.filter(
      (u) => u.socketId !== user.socketId,
    );
  }

  public static findUser(roomId: string, socketId: string): User | null {
    return (
      this.getUsers(roomId)?.find((user) => user.socketId === socketId) ?? null
    );
  }

  public static getUsers(roomId: string): User[] {
    this.rooms[roomId] = this.rooms[roomId] ?? [];
    return this.rooms[roomId];
  }
}
