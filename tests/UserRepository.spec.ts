import {
  User,
  UserRepository,
} from '../src/modules/shared/repository/UserRepository';
// @ts-ignore
import { mockUser1, mockUser2 } from './mocks/users.mock';

describe('Test user repository', () => {
  const userRepository = new UserRepository();

  it('It can save and find user', async () => {
    userRepository.create(mockUser1);
    const user = await userRepository.find(mockUser1.userId);

    expect(user).toEqual(mockUser1);
  });

  it('It can save and find multiple users', async () => {
    userRepository.create(mockUser1);
    userRepository.create(mockUser2);

    const users = await userRepository.findAllIn([
      mockUser1.userId,
      mockUser2.userId,
      'id-not-present',
    ]);

    expect(users.length).toEqual(2);
    expect([mockUser1, mockUser2]).toContainEqual(mockUser1);
    expect([mockUser1, mockUser2]).toContainEqual(mockUser2);
  });
});
