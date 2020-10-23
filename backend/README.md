# Wavelength Helper Backend

This project acts as a simple server that serves the static files for our frontend app as well as provides the logic for handling multiple client connections and keeping game state synchronized between all clients in a game room.

## App Overview

The app is built using the following technologies:

- Express.js, lightweight webserver for Node
- ExpressWs, websocket extension for express.js
- Immutable.js, for immutable data structures
- Winston, for logging

## Design

A group of players who want to play a game must all join the same room, which is accessed via appending a room name to the root server URL.

So if your game is hosted at foo.com and you and your friends want to join room "bar", you would enter `https://foo.com/bar` into your browser to join that room.

Upon launching the game, players are prompted to join one of the two teams, at which point their client will open a websocket connection to `ws://foo.com/<roomname>/ws`. The server will keep a collection of connections for each room and update this as connections are opened or closed. This enables the server to broadcast changes in state to all connected users to a room.

When a new client joins, the server will send that client the information about the current scores, who is the current player, and information about each connected player.

On disconnecting, the server will send a `userLeft` message to all other clients to let them know to remove that player from their local state.

Any other messages sent from clients will be broadcast to each connected player as a way to keep all clients in sync.

## Installing dependencies

Simply run:  
`yarn install`  
To install all the necessary dependencies (assuming you have Node.js installed)

## Building + Running

To build the server, just run:  
`yarn build`  
Then you can run the serve by running:  
`yarn start`
