
import { combineReducers } from 'redux-immutable';
import cardReducer from './card-reducer';
import guessReducer from './guess-reducer';
import answerReducer from './answer-reducer';
import deckReducer from './deck-reducer';

const allReducers = combineReducers({
    card: cardReducer,
    guess: guessReducer,
    answer: answerReducer,
    deck: deckReducer
});

export default allReducers;