import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import Server from './boot/Server';
import cors from 'cors';
import { AuthController } from './modules/auth/AuthController';

dotenv.config();

const PORT = parseInt(process.env.PORT!) || 8100;
const app: Application = express();
const server: Server = new Server(app, PORT);

// Bootstrap
Promise.resolve()
  // .then(() => server.initDatabase())
  // .then(() => Cache.initCache())
  .then(() => {
    server.loadMiddlewares([cors()]);
    server.loadControllers([new AuthController()]);
    server.run();
  });
