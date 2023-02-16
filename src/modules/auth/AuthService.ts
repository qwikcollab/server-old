import { User, UserRepository } from '../shared/repository/UserRepository';

export class AuthService {
  public constructor(private userRep = new UserRepository()) {}

  public registerUser(user: User) {
    return this.userRep.create(user);
  }
}
