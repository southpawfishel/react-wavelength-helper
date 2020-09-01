import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
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

let middleware: List<any> = List([applyMiddleware(thunk)]);
if (((window) as any).devToolsExtension) {
  middleware = middleware.push(((window) as any).devToolsExtension())
}

const appStore = createStore(
  allReducers,
  InitialState,
  compose(...middleware.toJS()));
export { appStore };