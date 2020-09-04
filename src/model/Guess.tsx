import { Record } from 'immutable';

interface IGuess {
  guess: number
}

const DefaultGuess: IGuess = {
  guess: 0.5
}

export const CreateGuess = (guess: number = 0.5) => {
  return new Guess({ guess: guess });
}

export class Guess extends Record(DefaultGuess) { };