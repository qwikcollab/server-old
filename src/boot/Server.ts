import { Application, RequestHandler } from 'express';
import http from 'http';
import Controller from '../modules/shared/BaseController';
import { Server as SocketServer } from 'socket.io';
import sockets from '../modules/sockets';

export default class Server {
  private readonly app: Application;
  private readonly port: number;

  constructor(app: Application, port: number) {
    this.app = app;
    this.port = port;
  }

  public run(): http.Server {
    const httpServer = http.createServer(this.app);
    const io = new SocketServer(httpServer);
    sockets(io);

    return httpServer.listen(this.port, () => {
      console.log(`The server is running on port ${this.port}`);
    });
  }

  public loadMiddlewares(middlewares: Array<RequestHandler>): void {
    middlewares.forEach((middleware) => {
      console.log('applying middleware');
      this.app.use(middleware);
    });
  }

  public loadControllers(controllers: Array<Controller>): void {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.setRoutes());
    });
  }
}
