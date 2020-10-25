"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const expressWs = require("express-ws");
const path = require("path");
const immutable_1 = require("immutable");
const winston_1 = require("winston");
const defaultGameState = {
    users: immutable_1.Map(),
    connections: immutable_1.Set(),
    round: undefined,
    score: undefined,
    cards: undefined,
};
class GameState extends immutable_1.Record(defaultGameState) {
}
/** Initialize our logging library */
const fileLogFormat = winston_1.format.combine(winston_1.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
}), winston_1.format.json());
const logger = winston_1.createLogger({
    level: 'info',
    format: fileLogFormat,
    transports: [
        new winston_1.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: './logs/combined.log' }),
    ],
});
const consoleLogFormat = winston_1.format.combine(winston_1.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
}), winston_1.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`));
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.transports.Console({
        format: consoleLogFormat,
    }));
}
/** Actual game server here */
let serverState = immutable_1.Map();
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
    var _a, _b, _c, _d, _e;
    const room = req.params.room;
    logger.info(`connection accepted for room: ${room}`);
    try {
        // Create room if it doesn't exist already
        serverState = serverState.set(room, serverState.get(room, new GameState()));
        // When new user connects, store websocket for broadcasting later
        serverState = serverState.updateIn([room, 'connections'], (connections) => connections.add(ws));
        // Upon joining, send info about already connected users
        (_a = serverState
            .get(room)) === null || _a === void 0 ? void 0 : _a.users.valueSeq().forEach((user) => ws.send(JSON.stringify(user)));
        // Send current round
        ((_b = serverState.get(room)) === null || _b === void 0 ? void 0 : _b.round) &&
            ws.send(JSON.stringify((_c = serverState.get(room)) === null || _c === void 0 ? void 0 : _c.round));
        // Send current scores
        ((_d = serverState.get(room)) === null || _d === void 0 ? void 0 : _d.score) &&
            ws.send(JSON.stringify((_e = serverState.get(room)) === null || _e === void 0 ? void 0 : _e.score));
    }
    catch (error) {
        logger.error(`Error in ws connection handler: ${error}`);
    }
    ws.on('message', (msg) => {
        var _a;
        try {
            logger.info(`[room ${room}] received message: ${msg}`);
            // Rebroadcast this message to all other users in this room
            (_a = serverState
                .get(room)) === null || _a === void 0 ? void 0 : _a.connections.filterNot((conn, _) => ws === conn).forEach((conn, _) => conn.send(msg));
            let msgObj = JSON.parse(msg.toString());
            switch (msgObj.type) {
                case 'userUpdate':
                    serverState = serverState.updateIn([room, 'users'], (usersMap) => usersMap.set(ws, msgObj));
                    break;
                case 'updateCards':
                    serverState = serverState.updateIn([room], (room) => room.set('cards', msgObj));
                    break;
                case 'startRound':
                    serverState = serverState.updateIn([room], (room) => room.set('round', msgObj));
                    break;
                case 'updateScore':
                    serverState = serverState.updateIn([room], (room) => room.set('score', msgObj));
                    break;
            }
        }
        catch (error) {
            logger.error(`Error in ws message handler: ${error}`);
        }
    });
    ws.on('close', (code, reason) => {
        var _a, _b, _c;
        try {
            logger.info(`[room ${room}] websocket closed with code ${code} ${reason.length > 0 ? `(reason: ${reason})` : ''}`);
            // Broadcast user-left message to all other users
            let disconnectId = (_a = serverState.get(room)) === null || _a === void 0 ? void 0 : _a.users.get(ws).uid;
            (_b = serverState
                .get(room)) === null || _b === void 0 ? void 0 : _b.connections.valueSeq().filterNot((conn) => ws === conn).forEach((conn) => {
                conn.send(JSON.stringify({
                    type: 'userLeft',
                    uid: disconnectId,
                }));
            });
            // Remove any references to this socket from our server state
            const connections = (_c = serverState.get(room)) === null || _c === void 0 ? void 0 : _c.connections;
            serverState = serverState.deleteIn([room, 'connections', ws]);
            serverState = serverState.deleteIn([room, 'users', ws]);
        }
        catch (error) {
            logger.error(`Error in ws close handler: ${error}`);
        }
    });
    ws.on('error', (error) => {
        logger.error(`[room ${room}] websocket error: ${error.message}`);
    });
});
app.listen(80);
//# sourceMappingURL=server.js.map