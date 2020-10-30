import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {
  setCard,
  setCardLeft,
  setCardRight,
  setRandomCard,
} from './deck-actions';
import {
  updateUser,
  removeUser,
  clearRemoteUsers,
  setTeam,
  setConnectionStatus,
  setClueGiver,
  setShownTeam,
  setScores,
} from './users-actions';
import { AppState } from '../AppStore';
import { Team, User, CreateUser, Scores } from '../../model/Users';
import { Card, CreateCard } from '../../model/Deck';
import {
  setAnswer,
  newTargetAnswer,
  showAnswer,
  hideAnswer,
} from './answer-actions';
import { CreateAnswer, Answer } from '../../model/Answer';

var socket: WebSocket | null = null;

const relativePath = (path: string) => {
  let loc = window.location;
  var finalUri;
  if (loc.protocol === 'https:') {
    finalUri = 'wss:';
  } else {
    finalUri = 'ws:';
  }
  finalUri += '//' + loc.host + loc.pathname;
  let separator = '';
  if (finalUri[finalUri.length - 1] !== '/') {
    separator = '/';
  }
  finalUri += separator + path;
  return finalUri;
};

export const connectSocket = (
  team: Team
): ThunkAction<void, AppState, unknown, Action<string>> => (
  dispatch,
  getState
) => {
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
    };

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
        case 'userUpdate': {
          dispatch(
            updateUser(
              CreateUser()
                .set('id', message['uid'])
                .set('team', message['team'])
                .set('guess', message['currGuess'])
                .set('name', message['username'])
            )
          );
          break;
        }
        case 'updateCards': {
          dispatch(
            setCard(
              CreateCard()
                .set('left', message['left'])
                .set('right', message['right'])
            )
          );
          break;
        }
        case 'startRound': {
          const clueGiverId = message['peep']['uid'];
          dispatch(setClueGiver(clueGiverId));
          // If we're the current clue giver, roll a new target
          if (getState().users.localUser.id === clueGiverId) {
            dispatch(newTargetAnswer(Math.random()));
            dispatch(showAnswer());
          } else {
            dispatch(hideAnswer());
          }
          const team = message['peep']['team'];
          dispatch(setShownTeam(team));
          break;
        }
        case 'reveal': {
          dispatch(
            setAnswer(
              CreateAnswer()
                .set('visible', true)
                .set('target', message['target'])
            )
          );
          break;
        }
        case 'updateScore': {
          const scores = new Scores(message['scores']);
          dispatch(setScores(scores));
          break;
        }
        case 'userLeft': {
          dispatch(removeUser(message['uid']));
          break;
        }
        default: {
          console.log('Encountered  unknown message type from server!');
          break;
        }
      }
    };
  } else {
    alert('Trying to connect socket when it is already connected!');
  }
};

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
    };
    socket.send(JSON.stringify(msg));
  }
};

export const startRound = (
  user: User
): ThunkAction<void, AppState, unknown, Action<string>> => (
  dispatch,
  getState
) => {
  if (socket !== null) {
    const msg = {
      type: 'startRound',
      peep: {
        uid: user.id,
        username: user.name,
        team: user.team,
        currGuess: user.guess,
      },
    };
    socket.send(JSON.stringify(msg));
  }
  dispatch(setRandomCard());
  dispatch(setClueGiver(user.id));
  if (getState().users.localUser.id === user.id) {
    dispatch(newTargetAnswer(Math.random()));
    dispatch(showAnswer());
  } else {
    dispatch(hideAnswer());
  }
};

export const revealAnswer = (
  answer: Answer
): ThunkAction<void, AppState, unknown, Action<string>> => (dispatch) => {
  if (socket !== null) {
    const msg = {
      type: 'reveal',
      target: answer.target,
    };
    socket.send(JSON.stringify(msg));
    dispatch(showAnswer());
  }
};

export const syncScores = (
  scores: Scores
): ThunkAction<void, AppState, unknown, Action<string>> => (dispatch) => {
  if (socket !== null) {
    const msg = {
      type: 'updateScore',
      scores: scores,
    };
    socket.send(JSON.stringify(msg));
    dispatch(setScores(scores));
  }
};

export const syncCardLeft = (
  left: string
): ThunkAction<void, AppState, unknown, Action<string>> => (
  dispatch,
  getState
) => {
  dispatch(setCardLeft(left));
  dispatch(syncCurrentCard(getState().deck.currentCard));
};

export const syncCardRight = (
  right: string
): ThunkAction<void, AppState, unknown, Action<string>> => (
  dispatch,
  getState
) => {
  dispatch(setCardRight(right));
  dispatch(syncCurrentCard(getState().deck.currentCard));
};

export const syncRandomCard = (): ThunkAction<
  void,
  AppState,
  unknown,
  Action<string>
> => (dispatch, getState) => {
  dispatch(setRandomCard());
  dispatch(syncCurrentCard(getState().deck.currentCard));
};

const syncCurrentCard = (
  card: Card
): ThunkAction<void, AppState, unknown, Action<string>> => (dispatch) => {
  if (socket !== null) {
    console.log(`syncing card: ${card.left} ${card.right}`);
    const msg = {
      type: 'updateCards',
      left: card.left,
      right: card.right,
    };
    socket.send(JSON.stringify(msg));
  }
};
