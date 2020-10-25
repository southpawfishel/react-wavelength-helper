import { Map } from 'immutable';
import {
  SET_GUESS,
  NUDGE_GUESS_LEFT,
  NUDGE_GUESS_RIGHT,
  SET_LOCAL_USER_NAME,
  SET_LOCAL_USER_TEAM,
  UPDATE_REMOTE_USER,
  REMOVE_REMOTE_USER,
  CLEAR_REMOTE_USERS,
  SET_CONNECTION_STATUS,
  SET_CLUE_GIVER,
  SET_SHOWN_TEAM,
  SET_SCORES,
} from '../actions/users-actions';
import { clamp } from '../../util/mathutil';
import { Users, CreateUsers } from '../../model/Users';

const usersReducer = (state: Users = CreateUsers(), action: any) => {
  switch (action.type) {
    case SET_GUESS:
      return state.set(
        'localUser',
        state.localUser.set('guess', action.payload.guess)
      );
    case NUDGE_GUESS_LEFT:
      return state.set(
        'localUser',
        state.localUser.set('guess', clamp(state.localUser.guess - 0.01))
      );
    case NUDGE_GUESS_RIGHT:
      return state.set(
        'localUser',
        state.localUser.set('guess', clamp(state.localUser.guess + 0.01))
      );
    case SET_LOCAL_USER_NAME:
      return state.set(
        'localUser',
        state.localUser.set('name', action.payload.name)
      );
    case SET_LOCAL_USER_TEAM:
      return state.set(
        'localUser',
        state.localUser.set('team', action.payload.team)
      );
    case UPDATE_REMOTE_USER:
      return state.set(
        'onlineUsers',
        state.onlineUsers.set(action.payload.user.id, action.payload.user)
      );
    case REMOVE_REMOTE_USER:
      return state.set(
        'onlineUsers',
        state.onlineUsers.delete(action.payload.uid)
      );
    case CLEAR_REMOTE_USERS:
      return state
        .set('onlineUsers', Map({}))
        .set('clueGiverId', null)
        .set('localUser', state.get('localUser').set('team', null));
    case SET_CONNECTION_STATUS:
      return state.set('connectionStatus', action.payload.status);
    case SET_CLUE_GIVER:
      return state.set('clueGiverId', action.payload.uid);
    case SET_SHOWN_TEAM:
      return state.set('shownTeam', action.payload.team);
    case SET_SCORES:
      return state.set('scores', action.payload.scores);
    default:
      return state;
  }
};

export default usersReducer;
