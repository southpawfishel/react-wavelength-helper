import { Record, List } from 'immutable';

type ICard = {
  left: string;
  right: string;
};

const DefaultCard: ICard = {
  left: 'Forbidden',
  right: 'Encouraged',
};

export const CreateCard = () => {
  return new Card(DefaultCard);
};

export class Card extends Record(DefaultCard) {}

type IDeck = {
  currentCard: Card;
  cards: List<Card>;
};

const DefaultDeck: IDeck = {
  currentCard: CreateCard(),
  cards: List([]),
};

export const CreateDeck = () => {
  return new Deck(DefaultDeck);
};

export class Deck extends Record(DefaultDeck) {}
