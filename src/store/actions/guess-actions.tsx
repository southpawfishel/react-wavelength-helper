import { Guess } from '../../model/Guess';

export const SET_GUESS = 'guess:set';
export const NUDGE_GUESS_LEFT = 'guess:left';
export const NUDGE_GUESS_RIGHT = 'guess:right';

export function setGuess(guess: Guess) {
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
