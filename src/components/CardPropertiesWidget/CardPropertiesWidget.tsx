import * as React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { randomElement } from '../../util/immutable-shuffle'
import { IAppState } from '../../store/AppStore';
import { Card } from '../../model/Card';
import { setCardLeft, setCardRight, setCard } from '../../store/actions/card-actions'

export interface ICardPropertiesWidgetProps {
  card: Card;
  deck: List<Card>;
  setLeftAction: typeof setCardLeft;
  setRightAction: typeof setCardRight;
  setCardAction: typeof setCard;
}

const CardPropertiesWidget = (props: ICardPropertiesWidgetProps) => {
  const onLeftItemChanged = React.useCallback((event) => {
    if (event.target.value !== null) {
      props.setLeftAction(event.target.value);
    }
  }, [props]);

  const onRightItemChanged = React.useCallback((event) => {
    if (event.target.value !== null) {
      props.setRightAction(event.target.value);
    }
  }, [props]);

  const onDrawRandomCard = React.useCallback((event) => {
    props.setCardAction(randomElement(props.deck));
  }, [props]);

  return (
    <div className='container' style={{ maxWidth: '100%' }}>
      <div className='CardPropertiesWidget'>
        <form>
          <div className='row'>
            <div className='column column-50'>
              <label htmlFor='leftItem'>Left option</label>
              <input type='text' id='leftItem' name='leftItem' value={props.card.left} onChange={onLeftItemChanged} />
            </div>
            <div className='column column-50'>
              <label htmlFor='rightItem'>Right option</label>
              <input type='text' id='rightItem' name='rightItem' value={props.card.right} onChange={onRightItemChanged} />
            </div>
          </div>
          {props.deck.isEmpty() === false &&
            <div className='row'>
              <div className='column'>
                <input type='button' style={{ width: '100%' }} value="Draw Random Card" onClick={onDrawRandomCard} />
              </div>
            </div>
          }
        </form>
      </div>
    </div>
  );
}

const mapStateToProps = (state: IAppState) => ({
  card: state.card,
  deck: state.deck
})

const mapDispatchToProps = {
  setLeftAction: setCardLeft,
  setRightAction: setCardRight,
  setCardAction: setCard,
}

export default connect(mapStateToProps, mapDispatchToProps)(CardPropertiesWidget);