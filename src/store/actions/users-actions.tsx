import { User } from '../../model/Users';

export const SET_GUESS = 'users:setLocalGuess';
export const NUDGE_GUESS_LEFT = 'users:nudgeLocalGuessLeft';
export const NUDGE_GUESS_RIGHT = 'users:nudgeLocalGuessRight';
export const UPDATE_USER = 'users:update';
export const REMOVE_USER = 'users:remove';

export function setGuess(guess: number) {
  return {
    type: SET_GUESS,
    payload: {
      guess
    }
  }
}

export function nudgeGuessLeft() {
  return {
    type: NUDGE_GUESS_LEFT,
    payload: {}
  }
}

export function nudgeGuessRight() {
  return {
    type: NUDGE_GUESS_RIGHT,
    payload: {}
  }
}

export function updateUser(user: User) {
  return {
    type: UPDATE_USER,
    payload: {
      user
    }
  }
}

export function removeUser(user: User) {
  return {
    type: REMOVE_USER,
    payload: {
      user
    }
  }
}
