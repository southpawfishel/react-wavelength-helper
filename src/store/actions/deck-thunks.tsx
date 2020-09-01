import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk';
import { Card } from '../../model/Card';
import { List } from 'immutable';
import { setDeck } from './deck-actions';
import { AppState } from '../AppStore';

export const loadDeck = (fromFile: File): ThunkAction<void, AppState, unknown, Action<string>> => dispatch => {
  const onFileLoaded = (e: ProgressEvent<FileReader>) => {
    if (e.target !== null) {
      const lines = e.target.result as string;
      if (lines !== null) {
        // If we made it this far, our file loaded just fine, parse the JSON array into a deck and dispatch the action
        const newDeck = List<Array<string>>(JSON.parse(lines)).map((element: Array<string>) => {
          return new Card({ left: element[0], right: element[1] })
        });
        newDeck.forEach(card => console.log(`${card.left}, ${card.right}`));
        dispatch(setDeck(newDeck));
      }
    }
  }
  // Load file asynchronously, file loaded callback will dispatch an event to the store
  let fr = new FileReader();
  fr.onload = onFileLoaded;
  fr.readAsText(fromFile);
}