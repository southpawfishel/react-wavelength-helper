import { Card } from '../../model/Deck';
import { List } from 'immutable';

export const SET_DECK = 'deck:setCards';
export const SET_CARD = 'deck:setCard';
export const SET_CARD_LEFT = 'deck:setLeft';
export const SET_CARD_RIGHT = 'deck:setRight';
export const SET_RANDOM_CARD = 'deck:setRandom';

export function setDeck(cards: List<Card>) {
  return {
    type: SET_DECK,
    payload: {
      cards
    }
  }
}

export function setCard(card: any) {
  return {
    type: SET_CARD,
    payload: {
      card
    }
  }
}

export function setCardLeft(left: string) {
  return {
    type: SET_CARD_LEFT,
    payload: {
      left
    }
  }
}

export function setCardRight(right: string) {
  return {
    type: SET_CARD_RIGHT,
    payload: {
      right
    }
  }
}

export function setRandomCard() {
  return {
    type: SET_RANDOM_CARD,
    payload: {}
  }
}