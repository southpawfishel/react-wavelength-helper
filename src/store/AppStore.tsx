import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Record, List } from 'immutable';
import allReducers from './reducers/AllReducers';
import { Card, CreateCard } from '../model/Card';
import { Answer, CreateAnswer } from '../model/Answer';
import { Users, CreateUsers } from '../model/Users';

export interface IAppState {
  users: Users
  card: Card,
  answer: Answer,
  deck: List<Card>
}

const DefaultAppState: IAppState = {
  users: CreateUsers(),
  card: CreateCard(),
  answer: CreateAnswer(),
  deck: List()
}

export class AppState extends Record(DefaultAppState) { };
const InitialState = new AppState();

let middleware: List<any> = List([applyMiddleware(thunk)]);
if (((window) as any).devToolsExtension) {
  middleware = middleware.push(((window) as any).devToolsExtension())
}
const logger = createLogger({});
middleware = middleware.push(applyMiddleware(logger))

const appStore = createStore(
  allReducers,
  InitialState,
  compose(...middleware.toJS()));
export { appStore };