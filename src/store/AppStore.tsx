import { createStore } from 'redux';
import { Record, List } from 'immutable';
import allReducers from './reducers/AllReducers';
import { Card } from '../model/Card';
import { Answer } from '../model/Answer';
import { Guess } from '../model/Guess';

export interface IAppState {
  card: Card,
  answer: Answer,
  guess: Guess,
  deck: List<Card>
}

const DefaultAppState: IAppState = {
  card: new Card(),
  answer: new Answer(),
  guess: new Guess(),
  deck: List()
}

export class AppState extends Record(DefaultAppState) { };
const InitialState = new AppState();

const appStore = createStore(
  allReducers,
  InitialState,
  ((window) as any).devToolsExtension &&
  ((window) as any).devToolsExtension());
export { appStore };