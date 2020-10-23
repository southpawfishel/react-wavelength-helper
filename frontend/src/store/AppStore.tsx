import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { Record, List } from "immutable";
import allReducers from "./reducers/AllReducers";
import { Deck, CreateDeck } from "../model/Deck";
import { Answer, CreateAnswer } from "../model/Answer";
import { Users, CreateUsers } from "../model/Users";

export interface IAppState {
  users: Users;
  answer: Answer;
  deck: Deck;
}

const DefaultAppState: IAppState = {
  users: CreateUsers(),
  answer: CreateAnswer(),
  deck: CreateDeck(),
};

export class AppState extends Record(DefaultAppState) {}
const InitialState = new AppState();

let middleware: List<any> = List([applyMiddleware(thunk)]);
if ((window as any).devToolsExtension) {
  middleware = middleware.push((window as any).devToolsExtension());
}
const logger = createLogger({});
middleware = middleware.push(applyMiddleware(logger));

const appStore = createStore(
  allReducers,
  InitialState,
  compose(...middleware.toJS())
);
export { appStore };
