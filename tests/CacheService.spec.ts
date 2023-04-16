import { mockUser1, mockUser2 } from './mocks/users.mock';
import { CacheService } from '../src/modules/cache/CacheService';

describe('Test user repository', () => {
  const cacheService = new CacheService();

  it('It can save and find user', async () => {
    cacheService.create(mockUser1);
    const user = await cacheService.find(mockUser1.userId);

    expect(user).toEqual(mockUser1);
  });

  it('It can save and find multiple users', async () => {
    cacheService.create(mockUser1);
    cacheService.create(mockUser2);

    const users = await cacheService.findAllIn([
      mockUser1.userId,
      mockUser2.userId,
      'id-not-present',
    ]);

    expect(users.length).toEqual(2);
    expect([mockUser1, mockUser2]).toContainEqual(mockUser1);
    expect([mockUser1, mockUser2]).toContainEqual(mockUser2);
  });
});
