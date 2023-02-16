import { Server } from 'socket.io';
import { ExistingState, JoinRoomMessage } from '../../types';
import { RoomsState } from '../states/RoomState';
import { Authority } from '../authority/Authority';
import { SocketSessionState } from '../states/SocketSessionState';

export default function (io: Server) {
  io.on('connection', async (socket) => {
    socket.on('join-room', (msg: JoinRoomMessage, callback) => {
      const user = msg;
      SocketSessionState.userMap[socket.id] = msg.userId;
      RoomsState.addUser(user);

      socket.join(msg.roomId);

      const info = Authority.getRoomData(msg.roomId);
      const existingState: ExistingState = {
        users: RoomsState.getUsers(msg.roomId),
        updates: info.updates,
        doc: info.doc,
      };
      callback(existingState);

      // Send to everyone in room
      socket.to(msg.roomId).emit('user-joined', user);
    });

    socket.on('disconnecting', () => {
      console.log('user disconnecting');
      socket.rooms.forEach((roomId: string) => {
        const userId = SocketSessionState.userMap[socket.id];
        RoomsState.removeUser(roomId, userId);
        socket.broadcast.to(roomId).emit('user-left', userId);
      });
      delete SocketSessionState.userMap[socket.id];
    });

    socket.on('updateFromClient', ({ version, updates, head }) => {
      const room = Array.from(socket.rooms).find((id) => id.length === 36);
      if (!room) {
        return;
      }
      let userId = SocketSessionState.userMap[socket.id] ?? ''; // TODO error-handling for ''
      console.log('update from client ', room);
      Authority.pullUpdatesAnsSyncWithClient(
        {
          version,
          updates,
          roomId: room,
          head,
          userId,
        },
        io,
      );
    });

    socket.on(
      'getPendingUpdates',
      ({ version, roomId, userId, name }, callback) => {
        const user = { userId, roomId, name };
        SocketSessionState.userMap[socket.id] = userId;
        RoomsState.addUser(user);
        socket.join(roomId);

        // send to everyone except sender
        socket.to(roomId).emit('user-joined', user);

        const { updates } = Authority.getRoomData(roomId);
        const pendingUpdates = updates
          .slice(version, updates.length)
          .map((u) => {
            return {
              serializedUpdates: u.changes.toJSON(),
              clientId: u.clientID,
            };
          });
        callback(pendingUpdates);
      },
    );

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
