import { createStore } from 'redux';
import allReducers from './reducers/AllReducers';
import { Card } from '../model/Card';
import { Answer } from '../model/Answer';
import { Guess } from '../model/Guess';

export interface IAppState {
  card: Card,
  answer: Answer,
  guess: Guess,
  deck: Card[]
}

const appStore = createStore(
  allReducers,
  ((window) as any).devToolsExtension &&
  ((window) as any).devToolsExtension());
export { appStore };