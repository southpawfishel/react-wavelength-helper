import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Deck } from '../model/Deck';
import { setRandomCard } from '../store/actions/deck-actions';
import {
  syncCardLeft,
  syncCardRight,
  syncRandomCard,
} from '../store/actions/websocket-thunks';

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
                value={deck.currentCard.left}
                onChange={onLeftItemChanged}
              />
            </div>
            <div className="column column-50">
              <label htmlFor="rightItem">Right option</label>
              <input
                type="text"
                id="rightItem"
                name="rightItem"
                value={deck.currentCard.right}
                onChange={onRightItemChanged}
              />
            </div>
          </div>
          {deck.cards.isEmpty() === false && (
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
