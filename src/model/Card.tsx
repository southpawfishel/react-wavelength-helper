import { Record } from 'immutable';

interface ICard {
  left: string,
  right: string
}

const DefaultCard: ICard = {
  left: 'Forbidden',
  right: 'Encouraged'
}

export const CreateCard = (props: ICard | null = null) => {
  if (props === null) {
    return new Card(DefaultCard);
  } else {
    return new Card(props);
  }
}

export class Card extends Record(DefaultCard) { };