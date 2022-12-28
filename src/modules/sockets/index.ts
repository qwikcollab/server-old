import { Server } from 'socket.io';
import {
  ExistingState,
  JoinRoomMessage,
} from '../../types';
import { RoomsState } from '../states/RoomState';
import { Authority } from '../authority/Authority';

export default function (io: Server) {
  io.on('connection', async (socket) => {
    console.log(`Socket id ${socket.id} connected`);

    socket.on('join-room', (msg: JoinRoomMessage, callback) => {
      const user = { ...msg, socketId: socket.id };
      RoomsState.addUser(user);

      socket.join(msg.roomId);

      const info = Authority.getRoomData(msg.roomId);
      const existingState: ExistingState = {
        users: RoomsState.getUsers(msg.roomId),
        updates: info.updates,
        doc: info.doc,
      };
      callback(existingState);

      socket.broadcast.to(msg.roomId).emit('user-joined', user);
    });

    socket.on('disconnecting', () => {
      console.log('user disconnecting');
      socket.rooms.forEach((roomId: string) =>
        RoomsState.removeUser(RoomsState.findUser(roomId, socket.id)),
      );
      socket.broadcast.emit('user-left', socket.id);
    });

    socket.on('updateFromClient', ({ version, updates, head }) => {
      const room = Array.from(socket.rooms).find((id) => id.length === 36);
      if (!room) {
        return;
      }
      let userId = RoomsState.findUser(room, socket.id)?.userId ?? ''; // TODO error-handling for ''
      console.log('update from client ', room);
      Authority.pullUpdatesAnsSyncWithClient(
        {
          version,
          updates,
          roomId: room,
          socketId: socket.id,
          head,
          userId,
        },
        io,
      );
    });

    socket.on('positionUpdateFromClient', ({ head, anchor, userId }) => {
      console.log('position update from client');
      const room = Array.from(socket.rooms).find((id) => id.length === 36);
      if (!room) {
        return;
      }
      socket.to(room).emit('positionUpdateFromServer', {
        socketId: socket.id,
        head,
        anchor,
        userId,
      });
    });
  });

  io.on('disconnect', async (socket) => {
    console.log(`Socket id ${socket.id} disconnected`);
  });

  io.on('reconnect', async (socket) => {
    console.log(`Socket id ${socket.id} reconnected`);
  });

  io.on('reconnect_attempt', async (socket) => {
    console.log(`Socket id ${socket.id} reconnect_attempt`);
  });
}
