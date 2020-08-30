import { Record } from 'immutable';

interface IAnswer {
  target: number,
  visible: boolean
}

const DefaultAnswer: IAnswer = {
  target: 0.75,
  visible: true
}

export class Answer extends Record(DefaultAnswer) { };