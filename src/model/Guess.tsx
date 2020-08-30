import { Record } from 'immutable';

interface IGuess {
  guess: number
}

const DefaultGuess: IGuess = {
  guess: 0.5
}

export class Guess extends Record(DefaultGuess) { };