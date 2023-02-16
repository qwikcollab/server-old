import BaseController, { Methods } from '../shared/BaseController';
import { AuthService } from './AuthService';
import { NextFunction, Request, Response } from 'express';

export class AuthController extends BaseController {
  private authService: AuthService;
  public path: string = '';

  public constructor() {
    super();
    this.authService = new AuthService();
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
    const { name, email, userId } = req.body;
    const resp = this.authService.registerUser({ name, email, userId });
    super.sendSuccess(res, resp);
  }
}
