import { Record } from 'immutable';

interface IAnswer {
  target: number,
  visible: boolean
}

const DefaultAnswer: IAnswer = {
  target: Math.random(),
  visible: false
}

export const CreateAnswer = () => {
  return new Answer(DefaultAnswer);
}

export class Answer extends Record(DefaultAnswer) { };