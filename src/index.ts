import * as dotenv from 'dotenv';
import * as http from 'http';
import app from './app';
import { Server } from 'socket.io';
import sockets from './modules/sockets';

dotenv.config();
const server = http.createServer(app);
const io = new Server(server);
sockets(io);

server.listen(process.env.PORT, () => {
  console.log(`qc server has started at port ${process.env.PORT}!!`);
});
