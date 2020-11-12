import { Answer } from '../../model/Answer';
import {
  SET_ANSWER,
  SHOW_ANSWER,
  HIDE_ANSWER,
  NEW_TARGET,
  TOGGLE_ANSWER,
} from '../actions/answer-actions';

const answerReducer = (state: Answer, action: any) => {
  switch (action.type) {
    case SET_ANSWER:
      return action.payload.answer;
    case NEW_TARGET:
      return state.set('target', action.payload.target);
    case SHOW_ANSWER:
      return state.set('visible', true);
    case HIDE_ANSWER:
      return state.set('visible', false);
    case TOGGLE_ANSWER:
      return state.set('visible', !state.get('visible'));
    default:
      return state;
  }
};

export default answerReducer;
