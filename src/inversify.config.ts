import { Container } from 'inversify';
import { TYPES } from './types';
import { CacheService, ICacheService } from './modules/cache/CacheService';
import { AuthService, IAuthService } from './modules/auth/AuthService';

export const myContainer = new Container();


myContainer.bind<ICacheService>(TYPES.CacheService).to(CacheService);
myContainer.bind<IAuthService>(TYPES.AuthService).to(AuthService);
