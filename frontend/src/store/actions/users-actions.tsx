import { User, Team, ConnectionStatus, Scores } from '../../model/Users';

export const SET_GUESS = 'users:setLocalGuess';
export const NUDGE_GUESS_LEFT = 'users:nudgeLocalGuessLeft';
export const NUDGE_GUESS_RIGHT = 'users:nudgeLocalGuessRight';
export const SET_LOCAL_USER_NAME = 'users:setLocalName';
export const SET_LOCAL_USER_TEAM = 'users:setLocalTeam';
export const UPDATE_REMOTE_USER = 'users:updateRemote';
export const REMOVE_REMOTE_USER = 'users:removeRemote';
export const CLEAR_REMOTE_USERS = 'users:clearRemote';
export const SET_CONNECTION_STATUS = 'users:setConnectionStatus';
export const SET_CLUE_GIVER = 'users:setClueGiver';
export const SET_SHOWN_TEAM = 'users:setShownTeam';
export const SET_SCORES = 'users:setScores';

export function setGuess(guess: number) {
  return {
    type: SET_GUESS,
    payload: {
      guess,
    },
  };
}

export function nudgeGuessLeft() {
  return {
    type: NUDGE_GUESS_LEFT,
    payload: {},
  };
}

export function nudgeGuessRight() {
  return {
    type: NUDGE_GUESS_RIGHT,
    payload: {},
  };
}

export function setUserName(name: string) {
  return {
    type: SET_LOCAL_USER_NAME,
    payload: {
      name,
    },
  };
}

export function setTeam(team: Team) {
  return {
    type: SET_LOCAL_USER_TEAM,
    payload: {
      team,
    },
  };
}

export function updateUser(user: User) {
  return {
    type: UPDATE_REMOTE_USER,
    payload: {
      user,
    },
  };
}

export function removeUser(uid: string) {
  return {
    type: REMOVE_REMOTE_USER,
    payload: {
      uid,
    },
  };
}

export function clearRemoteUsers() {
  return {
    type: CLEAR_REMOTE_USERS,
    payload: {},
  };
}

export function setConnectionStatus(status: ConnectionStatus) {
  return {
    type: SET_CONNECTION_STATUS,
    payload: {
      status,
    },
  };
}

export function setClueGiver(uid: string) {
  return {
    type: SET_CLUE_GIVER,
    payload: {
      uid,
    },
  };
}

export function setShownTeam(team: Team) {
  return {
    type: SET_SHOWN_TEAM,
    payload: {
      team,
    },
  };
}

export function setScores(scores: Scores) {
  return {
    type: SET_SCORES,
    payload: {
      scores,
    },
  };
}
