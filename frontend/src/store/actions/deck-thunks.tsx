import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { CreateCard } from '../../model/Deck';
import { List } from 'immutable';
import { setDeck } from './deck-actions';
import { AppState } from '../AppStore';

const onDeckDataLoaded = (data: string, dispatch: any) => {
  const newDeck = List<Array<string>>(
    JSON.parse(data)
  ).map((element: Array<string>) =>
    CreateCard().set('left', element[0]).set('right', element[1])
  );
  dispatch(setDeck(newDeck));
};

export const loadDeck = (
  fromFile: File
): ThunkAction<void, AppState, unknown, Action<string>> => (dispatch) => {
  const onFileLoaded = (e: ProgressEvent<FileReader>) => {
    if (e.target !== null) {
      const lines = e.target.result as string;
      if (lines !== null) {
        // If we made it this far, our file loaded just fine, parse the JSON array into a deck and dispatch the action
        onDeckDataLoaded(lines, dispatch);
      }
    }
  };
  // Load file asynchronously, file loaded callback will dispatch an event to the store
  let fr = new FileReader();
  fr.onload = onFileLoaded;
  fr.readAsText(fromFile);
};

export const loadDeckFromRemote = (): ThunkAction<
  void,
  AppState,
  unknown,
  Action<string>
> => (dispatch) => {
  const loc = window.location;
  const url = `${loc.protocol}/data/wavelength_cards_all.json`;
  fetch(url)
    .then((response) => response.text())
    .then((data) => onDeckDataLoaded(data, dispatch))
    .catch((err) => {
      console.error(`failed to load deck data: ${err}`);
    });
};
