import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Deck } from '../model/Deck';
import { loadDeck } from '../store/actions/deck-thunks';

export interface ICardLoadingFormProps {
  deck: Deck;
  loadDeckThunk: any;
}

const CardLoadingWidget = (props: ICardLoadingFormProps) => {
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [file, setFile] = React.useState<File | null>(null);

  const handleLoadPressed = React.useCallback(() => {
    if (file !== null) {
      props.loadDeckThunk(file);
    } else {
      alert('Unable to load deck, file is null!');
    }
  }, [props, file]);

  const handleFileChanged = React.useCallback(() => {
    if (fileInput.current) {
      if (
        fileInput.current.files !== undefined &&
        fileInput.current.files !== null
      ) {
        const files: FileList = fileInput.current.files;
        if (files.length > 0) {
          const firstFile = files[0];
          setDisabled(false);
          setFile(firstFile);
        }
      } else {
        setDisabled(true);
        setFile(null);
      }
    }
  }, [fileInput, setFile]);

  let deckStatus: string = props.deck.cards.isEmpty()
    ? 'No deck file has been loaded'
    : `${props.deck.cards.count()} cards loaded into deck`;

  return (
    <div className="container" style={{ maxWidth: '100%' }}>
      <div className="CardLoadingForm">
        <form id="cardLoader">
          <div className="row">
            <div className="column">
              <fieldset>
                <label htmlFor="cardFileInput">{deckStatus}</label>
                <input
                  type="file"
                  ref={fileInput}
                  onChange={handleFileChanged}
                />
                <input
                  type="button"
                  value="Load"
                  disabled={disabled}
                  onClick={handleLoadPressed}
                />
              </fieldset>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  deck: state.deck,
});

const mapDispatchToProps = {
  loadDeckThunk: loadDeck,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardLoadingWidget);
