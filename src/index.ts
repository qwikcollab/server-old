import * as dotenv from 'dotenv';
import 'reflect-metadata'; // required for class decorators
import express, { Application } from 'express';
import Server from './boot/Server';
import { AuthController } from './modules/auth/AuthController';
import { myContainer } from './inversify.config';
dotenv.config();

const PORT = parseInt(process.env.PORT!) || 8100;
const app: Application = express();
const server: Server = new Server(app, PORT);

// Bootstrap
Promise.resolve().then(() => {
  console.log((process.env.CLIENT_URL ?? '').split(','));
  server.loadMiddlewares([
    (req, res, next) => {
      res.setHeader(
        'Access-Control-Allow-Origin',
        process.env.CLIENT_URL ?? '',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
      );
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin',
      );

      next();
    },
  ]);
  server.loadControllers([new AuthController()]);
  server.run();
});
