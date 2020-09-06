import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk';
import { setCard } from './card-actions';
import { updateUser, removeUser, clearRemoteUsers, setTeam, setConnectionStatus, setClueGiver } from './users-actions';
import { AppState } from '../AppStore';
import { Team, User } from '../../model/Users';
import { CreateCard } from '../../model/Card';

var socket: WebSocket | null = null;

const relativePath = (path: string) => {
  // let loc = window.location;
  // var finalUri;
  // if (loc.protocol === "https:") {
  //   finalUri = "wss:";
  // } else {
  //   finalUri = "ws:";
  // }
  // finalUri += "//" + loc.host;
  // finalUri += loc.pathname + path;
  // return finalUri;
  return 'ws://localhost:8080/foo1/ws';
}

export const connectSocket = (team: Team): ThunkAction<void, AppState, unknown, Action<string>> => dispatch => {
  if (socket === null) {
    socket = new WebSocket(relativePath('ws'));
    dispatch(setConnectionStatus('connecting'));

    socket.onopen = (event) => {
      dispatch(setTeam(team));
      dispatch(setConnectionStatus('connected'));
    };

    socket.onerror = (event: any) => {
      console.log(`Socket error: ${event.data}`);
      socket?.close();
    }

    socket.onclose = (event) => {
      dispatch(setConnectionStatus('not_connected'));
      dispatch(clearRemoteUsers());
      socket = null;
    };

    socket.onmessage = (event) => {
      if (event.data === null) {
        return;
      }

      const message = JSON.parse(event.data);
      if (message === null) {
        return;
      }

      switch (message['type']) {
        case 'userUpdate':
          const user = new User({
            id: message['uid'],
            team: message['team'],
            guess: message['currGuess'],
            name: message['username']
          });
          dispatch(updateUser(user));
          break;
        case 'updateCards':
          dispatch(setCard(CreateCard({ left: message['left'], right: message['right'] })));
          break;
        case 'startRound':
          dispatch(setClueGiver(message['uid']));
          break;
        case 'reveal':
          // TODO:
          break;
        case 'updateScore':
          // TODO:
          break;
        case 'userLeft':
          dispatch(removeUser(message['uid']));
          break;
        default:
          console.log('Encountered  unknown message type from server!');
          break;
      }
    }
  } else {
    alert('Trying to connect socket when it is already connected!');
  }
}

// const disconnectSocket = () => {
//   if (socket !== null) {
//     socket.close();
//   }
// }

export const syncUserToServer = (user: User) => {
  // If we're connected, send guess to server
  if (socket !== null) {
    const msg = {
      type: 'userUpdate',
      uid: user.id,
      username: user.name,
      team: user.team,
      currGuess: user.guess,
    }
    socket.send(JSON.stringify(msg));
  }
}
