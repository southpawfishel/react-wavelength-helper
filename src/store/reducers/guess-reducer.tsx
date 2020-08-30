import { Guess } from '../../model/Guess';
import { SET_GUESS, NUDGE_GUESS_LEFT, NUDGE_GUESS_RIGHT } from '../actions/guess-actions';
import { clamp } from '../../util/mathutil'

const guessReducer = (state: Guess = new Guess(), action: any) => {
  switch (action.type) {
    case SET_GUESS:
      return action.payload.guess;
    case NUDGE_GUESS_LEFT:
      return state.set('guess', clamp(state.guess - 0.01));
    case NUDGE_GUESS_RIGHT:
      return state.set('guess', clamp(state.guess + 0.01));
    default:
      return state;
  }
}

export default guessReducer;