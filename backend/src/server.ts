import * as express from 'express';
import expressWs = require('express-ws');
import path = require('path');
import { Map, Record, List, Set } from 'immutable';
import { transports, createLogger, format } from 'winston';

/** State definitions (yeah, the any typing is wack, but works for now) */

type IGameState = {
  users: Map<any, any>; // Maps websocket -> user
  connections: List<any>; // Contains one websocket for each connected user
  round?: any; // Contains most recent round start message
  score?: any; // Contains most recent score update message
  cards?: any; // Contains most recent card update message
};

const defaultGameState = {
  users: Map<any, any>(),
  connections: Set<any>(),
  round: undefined,
  score: undefined,
  cards: undefined,
};

class GameState extends Record(defaultGameState) {}

/** Initialize our logging library */

const fileLogFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.json()
);
const logger = createLogger({
  level: 'info',
  format: fileLogFormat,
  transports: [
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    new transports.File({ filename: './logs/combined.log' }),
  ],
});

const consoleLogFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: consoleLogFormat,
    })
  );
}

/** Actual game server here */

let serverState: Map<string, GameState> = Map();
const { app } = expressWs(express());

let buildDir = path.join(__dirname, '..', '..', '..', 'frontend', 'build');

// Static file serving
app.use(express.static(path.join(buildDir, 'static')));
app.use(express.static(buildDir));

// Root route should not be usable
app.get('/', (req, res) => {
  res.send('You need to specify a room. Try http://davesies.com/roomName');
});

// Serve index.html for any routes that point to a room
app.get('/:room([a-zA-Z0-9]+)', (req, res) => {
  logger.info(`serving index for room: ${req.params.room}`);
  res.sendFile(path.join(buildDir, 'index.html'));
});

// Handle websocket routes to roomName/ws
app.ws('/:room([a-zA-Z0-9]+)/ws', function (ws, req) {
  const room = req.params.room;
  logger.info(`connection accepted for room: ${room}`);

  try {
    // Create room if it doesn't exist already
    serverState = serverState.set(room, serverState.get(room, new GameState()));

    // When new user connects, store websocket for broadcasting later
    serverState = serverState.updateIn([room, 'connections'], (connections) =>
      connections.add(ws)
    );

    // Upon joining, send info about already connected users
    serverState
      .get(room)
      ?.users.valueSeq()
      .forEach((user) => ws.send(JSON.stringify(user)));

    // Send current round
    serverState.get(room)?.round &&
      ws.send(JSON.stringify(serverState.get(room)?.round));

    // Send current scores
    serverState.get(room)?.score &&
      ws.send(JSON.stringify(serverState.get(room)?.score));
  } catch (error) {
    logger.error(`Error in ws connection handler: ${error}`);
  }

  ws.on('message', (msg) => {
    try {
      logger.info(`[room ${room}] received message: ${msg}`);

      // Rebroadcast this message to all other users in this room
      serverState
        .get(room)
        ?.connections.filterNot((conn, _) => ws === conn)
        .forEach((conn, _) => conn.send(msg));

      let msgObj = JSON.parse(msg.toString());
      switch (msgObj.type) {
        case 'userUpdate':
          serverState = serverState.updateIn([room, 'users'], (usersMap) =>
            usersMap.set(ws, msgObj)
          );
          break;
        case 'updateCards':
          serverState = serverState.updateIn([room], (room) =>
            room.set('cards', msgObj)
          );
          break;
        case 'startRound':
          serverState = serverState.updateIn([room], (room) =>
            room.set('round', msgObj)
          );
          break;
        case 'updateScore':
          serverState = serverState.updateIn([room], (room) =>
            room.set('score', msgObj)
          );
          break;
      }
    } catch (error) {
      logger.error(`Error in ws message handler: ${error}`);
    }
  });

  ws.on('close', (code, reason) => {
    try {
      logger.info(
        `[room ${room}] websocket closed with code ${code} ${
          reason.length > 0 ? `(reason: ${reason})` : ''
        }`
      );

      // Broadcast user-left message to all other users
      let disconnectId = serverState.get(room)?.users.get(ws).uid;
      serverState
        .get(room)
        ?.connections.valueSeq()
        .filterNot((conn) => ws === conn)
        .forEach((conn) => {
          conn.send(
            JSON.stringify({
              type: 'userLeft',
              uid: disconnectId,
            })
          );
        });

      // Remove any references to this socket from our server state
      const connections = serverState.get(room)?.connections;
      serverState = serverState.deleteIn([room, 'connections', ws]);
      serverState = serverState.deleteIn([room, 'users', ws]);
    } catch (error) {
      logger.error(`Error in ws close handler: ${error}`);
    }
  });

  ws.on('error', (error) => {
    logger.error(`[room ${room}] websocket error: ${error.message}`);
  });
});

app.listen(80);
