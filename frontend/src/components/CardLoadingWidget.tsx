import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Deck } from '../model/Deck';
import { loadDeck } from '../store/actions/deck-thunks';
import { Button, Layout, Text } from '../ui';
import styled from 'styled-components';

export type ICardLoadingFormProps = {
  deck: Deck;
  loadDeckThunk: any;
};

const ScFieldSet = styled.fieldset`
  border-style: groove;
  border-radius: 0.5rem;
`;

const CardLoadingWidget: React.FC<ICardLoadingFormProps> = ({
  deck,
  loadDeckThunk,
}) => {
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [file, setFile] = React.useState<File | null>(null);

  const handleLoadPressed = React.useCallback(() => {
    if (file !== null) {
      loadDeckThunk(file);
    } else {
      alert('Unable to load deck, file is null!');
    }
  }, [loadDeckThunk, file]);

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

  let deckStatus: string = deck.cards.isEmpty()
    ? 'No deck file has been loaded'
    : `${deck.cards.count()} cards loaded into deck`;

  return (
    <Layout>
      <ScFieldSet>
        <Text>{deckStatus}</Text>
        <br />
        <input type="file" ref={fileInput} onChange={handleFileChanged} />
        <Button
          disabled={disabled}
          background={'purple'}
          onClick={handleLoadPressed}
        >
          <Text color={'white'}>Load</Text>
        </Button>
      </ScFieldSet>
    </Layout>
  );
};

const mapStateToProps = (state: IAppState) => ({
  deck: state.deck,
});

const mapDispatchToProps = {
  loadDeckThunk: loadDeck,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardLoadingWidget);
