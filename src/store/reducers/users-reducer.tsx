import { SET_GUESS, NUDGE_GUESS_LEFT, NUDGE_GUESS_RIGHT } from '../actions/users-actions';
import { clamp } from '../../util/mathutil'
import { Users, CreateUsers } from '../../model/Users';

const usersReducer = (state: Users = CreateUsers(), action: any) => {
  switch (action.type) {
    case SET_GUESS:
      return state.set('localUser', state.localUser.set('guess', action.payload.guess))
    case NUDGE_GUESS_LEFT:
      return state.set('localUser', state.localUser.set('guess', clamp(state.localUser.guess - 0.01)));
    case NUDGE_GUESS_RIGHT:
      return state.set('localUser', state.localUser.set('guess', clamp(state.localUser.guess + 0.01)));
    default:
      return state;
  }
}

export default usersReducer;