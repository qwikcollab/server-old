import { RoomRepository } from '../src/modules/shared/repository/RoomRepository';
import { UserRepository } from '../src/modules/shared/repository/UserRepository';
import { mockUser1, mockUser2 } from './mocks/users.mock';

describe('Test Room Repository', () => {
  const userRepository = new UserRepository();
  const roomRepository = new RoomRepository(userRepository);

  userRepository.create(mockUser1);
  userRepository.create(mockUser2);

  it('should should insert user in room', function () {
    // roomRepository.addUser()
  });
});
