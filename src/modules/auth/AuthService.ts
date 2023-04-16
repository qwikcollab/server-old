import { TYPES, User } from '../../types';
import { CacheService } from '../cache/CacheService';
import { inject, injectable } from 'inversify';
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export interface IAuthService {
  userRep: CacheService;
  registerUser(user: User): User;
  verifyGoogleToken(token: string): any;
}

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject(TYPES.CacheService) public userRep: CacheService) {}

  public registerUser(user: User) {
    return this.userRep.create(user);
  }

  public async verifyGoogleToken(token: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });
      return { payload: ticket.getPayload() };
    } catch (error) {
      return { error: 'Invalid user detected. Please try again' };
    }
  }
}
