import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk';
import { setCard } from './deck-actions';
import { updateUser, removeUser, clearRemoteUsers, setTeam, setConnectionStatus, setClueGiver } from './users-actions';
import { AppState } from '../AppStore';
import { Team, User, CreateUser } from '../../model/Users';
import { CreateCard } from '../../model/Deck';
import { setAnswer, newTargetAnswer } from './answer-actions';
import { CreateAnswer } from '../../model/Answer';

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

export const connectSocket = (team: Team): ThunkAction<void, AppState, unknown, Action<string>> => (dispatch, getState) => {
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
          console.log(`received user info: ${event.data}`);
          dispatch(updateUser(CreateUser()
            .set('id', message['uid'])
            .set('team', message['team'])
            .set('guess', message['currGuess'])
            .set('name', message['username'])));
          break;
        case 'updateCards':
          dispatch(setCard(CreateCard()
            .set('left', message['left'])
            .set('right', message['right'])));
          break;
        case 'startRound':
          const clueGiverId = message['peep']['uid'];
          dispatch(setClueGiver(clueGiverId));
          // If we're the current clue giver, roll a new target
          if (getState().users.localUser.id === clueGiverId) {
            dispatch(newTargetAnswer(Math.random()));
          }
          break;
        case 'reveal':
          dispatch(setAnswer(CreateAnswer()
            .set('visible', true)
            .set('target', message['target'])));
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

export const startRound = (user: User): ThunkAction<void, AppState, unknown, Action<string>> => dispatch => {
  if (socket !== null) {
    const msg = {
      type: 'startRound',
      peep: {
        uid: user.id,
        username: user.name,
        team: user.team,
        currGuess: user.guess,
      }
    }
    socket.send(JSON.stringify(msg));
  }
  dispatch(setClueGiver(user.id))
}
