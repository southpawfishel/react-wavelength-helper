import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Deck } from '../model/Deck';
import {
  syncCardLeft,
  syncCardRight,
  syncRandomCard,
} from '../store/actions/websocket-thunks';
import {
  AlignItems,
  Button,
  FlexDirection,
  JustifyContent,
  Layout,
  Text,
} from '../ui';
import styled from 'styled-components';

const ScInput = styled.input`
  height: 2rem;
  font-size: 1.1rem;
`;

export type ICardPropertiesWidgetProps = {
  deck: Deck;
  setLeftAction: any;
  setRightAction: any;
  setRandomCardAction: any;
};

const CardPropertiesWidget: React.FC<ICardPropertiesWidgetProps> = ({
  deck,
  setLeftAction,
  setRightAction,
  setRandomCardAction,
}) => {
  const onLeftItemChanged = React.useCallback(
    (event) => {
      if (event.target.value !== null) {
        setLeftAction(event.target.value);
      }
    },
    [setLeftAction]
  );

  const onRightItemChanged = React.useCallback(
    (event) => {
      if (event.target.value !== null) {
        setRightAction(event.target.value);
      }
    },
    [setRightAction]
  );

  const onDrawRandomCard = React.useCallback(() => {
    setRandomCardAction();
  }, [setRandomCardAction]);

  return (
    <Layout flexDirection={FlexDirection.Column}>
      <Layout justifyContent={JustifyContent.SpaceEvenly}>
        <Layout alignItems={AlignItems.Center}>
          <Layout paddingRight={'0.5rem'}>
            <Text>Left option</Text>
          </Layout>
          <ScInput
            type="text"
            id="leftItem"
            name="leftItem"
            value={deck.currentCard.left}
            onChange={onLeftItemChanged}
          />
        </Layout>
        <Layout alignItems={AlignItems.Center}>
          <Layout paddingRight={'0.5rem'}>
            <Text>Right option</Text>
          </Layout>
          <ScInput
            type="text"
            id="rightItem"
            name="rightItem"
            value={deck.currentCard.right}
            onChange={onRightItemChanged}
          />
        </Layout>
      </Layout>
      <Layout justifyContent={JustifyContent.Center} padding={'1rem 0rem'}>
        {deck.cards.isEmpty() === false && (
          <Button background={'purple'} onClick={onDrawRandomCard}>
            <Text color={'white'}>Draw Random Card</Text>
          </Button>
        )}
      </Layout>
    </Layout>
  );
};

const mapStateToProps = (state: IAppState) => ({
  deck: state.deck,
});

const mapDispatchToProps = {
  setLeftAction: syncCardLeft,
  setRightAction: syncCardRight,
  setRandomCardAction: syncRandomCard,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardPropertiesWidget);
