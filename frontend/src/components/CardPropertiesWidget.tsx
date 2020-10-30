import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Deck } from '../model/Deck';
import {
  syncCardLeft,
  syncCardRight,
  syncRandomCard,
} from '../store/actions/websocket-thunks';

export interface ICardPropertiesWidgetProps {
  deck: Deck;
  setLeftAction: any;
  setRightAction: any;
  setRandomCardAction: any;
}

const CardPropertiesWidget = (props: ICardPropertiesWidgetProps) => {
  const onLeftItemChanged = React.useCallback(
    (event) => {
      if (event.target.value !== null) {
        props.setLeftAction(event.target.value);
      }
    },
    [props]
  );

  const onRightItemChanged = React.useCallback(
    (event) => {
      if (event.target.value !== null) {
        props.setRightAction(event.target.value);
      }
    },
    [props]
  );

  const onDrawRandomCard = React.useCallback(
    (event) => {
      props.setRandomCardAction();
    },
    [props]
  );

  return (
    <div className="container" style={{ maxWidth: '100%' }}>
      <div className="CardPropertiesWidget">
        <form>
          <div className="row">
            <div className="column column-50">
              <label htmlFor="leftItem">Left option</label>
              <input
                type="text"
                id="leftItem"
                name="leftItem"
                value={props.deck.currentCard.left}
                onChange={onLeftItemChanged}
              />
            </div>
            <div className="column column-50">
              <label htmlFor="rightItem">Right option</label>
              <input
                type="text"
                id="rightItem"
                name="rightItem"
                value={props.deck.currentCard.right}
                onChange={onRightItemChanged}
              />
            </div>
          </div>
          {props.deck.cards.isEmpty() === false && (
            <div className="row">
              <div className="column">
                <input
                  type="button"
                  style={{ width: '100%' }}
                  value="Draw Random Card"
                  onClick={onDrawRandomCard}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
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
