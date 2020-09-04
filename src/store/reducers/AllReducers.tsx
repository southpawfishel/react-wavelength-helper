
import { combineReducers } from 'redux-immutable';
import cardReducer from './card-reducer';
import answerReducer from './answer-reducer';
import deckReducer from './deck-reducer';
import usersReducer from './users-reducer';

const allReducers = combineReducers({
    users: usersReducer,
    card: cardReducer,
    answer: answerReducer,
    deck: deckReducer
});

export default allReducers;