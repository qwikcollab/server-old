import BaseController, { Methods } from '../shared/BaseController';
import { AuthService } from './AuthService';
import { NextFunction, Request, Response } from 'express';
import { myContainer } from '../../inversify.config';
import { TYPES } from '../../types';

export class AuthController extends BaseController {
  public path: string = '';

  public constructor(
    public authService: AuthService = myContainer.get(TYPES.AuthService),
  ) {
    super();
  }

  routes = [
    {
      path: '/register',
      method: Methods.POST,
      handler: this.register,
      localMiddleware: [],
    },
  ];

  async register(req: Request, res: Response, next: NextFunction) {
    const credential = req.body?.credential;
    const resp = await this.authService.verifyGoogleToken(credential);
    super.sendSuccess(res, resp);
  }
}
