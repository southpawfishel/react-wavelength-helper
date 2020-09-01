import { Card } from '../../model/Card';
import { List } from 'immutable';

export const SET_DECK = 'deck:set';

export function setDeck(deck: List<Card>) {
  return {
    type: SET_DECK,
    payload: {
      deck
    }
  }
}