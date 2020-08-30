import { Record } from 'immutable';

interface ICard {
  left: string,
  right: string
}

const DefaultCard: ICard = {
  left: 'Forbidden',
  right: 'Encouraged'
}

export class Card extends Record(DefaultCard) { };