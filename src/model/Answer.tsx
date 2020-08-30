import { Record } from 'immutable';

interface IAnswer {
  target: number,
  visible: boolean
}

const DefaultAnswer: IAnswer = {
  target: Math.random(),
  visible: true
}

export class Answer extends Record(DefaultAnswer) { };