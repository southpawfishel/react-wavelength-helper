
import { combineReducers } from 'redux-immutable';
import answerReducer from './answer-reducer';
import usersReducer from './users-reducer';
import deckReducer from './deck-reducer';

const allReducers = combineReducers({
    users: usersReducer,
    answer: answerReducer,
    deck: deckReducer
});

export default allReducers;