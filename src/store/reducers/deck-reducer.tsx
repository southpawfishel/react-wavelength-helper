import { Deck, CreateDeck } from '../../model/Deck';
import { SET_DECK, SET_CARD, SET_CARD_LEFT, SET_CARD_RIGHT, SET_RANDOM_CARD } from '../actions/deck-actions';
import { randomElement } from '../../util/immutable-shuffle';

const deckReducer = (state: Deck = CreateDeck(), action: any) => {
  switch (action.type) {
    case SET_DECK:
      return state.set('cards', action.payload.cards);
    case SET_CARD:
      return state.set('currentCard', action.payload.card);
    case SET_CARD_LEFT:
      return state.set('currentCard', state.currentCard.set('left', action.payload.left));
    case SET_CARD_RIGHT:
      return state.set('currentCard', state.currentCard.set('right', action.payload.right));
    case SET_RANDOM_CARD:
      return state.set('currentCard', randomElement(state.cards));
    default:
      return state;
  }
}

export default deckReducer;