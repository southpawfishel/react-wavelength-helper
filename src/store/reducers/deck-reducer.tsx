import { Card } from '../../model/Card';
import { SET_DECK } from '../actions/deck-actions';

const deckReducer = (state: Card[], action: any) => {
  switch (action.type) {
    case SET_DECK:
      return action.payload.deck;
    default:
      return state;
  }
}

export default deckReducer;