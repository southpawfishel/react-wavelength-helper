import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../store/AppStore';
import { Card } from '../../model/Card';
import { setCard } from '../../store/actions/card-actions'

export interface IManualCardEditorProps {
  card: Card;
  setCardAction: (card: Card) => { type: string, payload: { card: Card } };
}

const ManualCardEditor = (props: IManualCardEditorProps) => {
  const onLeftItemChanged = React.useCallback((event) => {
    if (event.target.value !== null) {
      props.setCardAction(props.card.set('left', event.target.value));
    }
  }, [props]);

  const onRightItemChanged = React.useCallback((event) => {
    if (event.target.value !== null) {
      props.setCardAction(props.card.set('right', event.target.value));
    }
  }, [props]);

  return (
    <div className='container' style={{ maxWidth: '75%' }}>
      <div className='ManualCardEditor'>
        <form>
          <div className='row'>
            <div className='column'>
              <label htmlFor='leftItem'>Left option</label>
              <input type='text' id='leftItem' name='leftItem' value={props.card.left} onChange={onLeftItemChanged} />
            </div>
            <div className='column'>
              <label htmlFor='rightItem'>Right option</label>
              <input type='text' id='rightItem' name='rightItem' value={props.card.right} onChange={onRightItemChanged} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const mapStateToProps = (state: IAppState) => ({
  card: state.card
})

const mapDispatchToProps = {
  setCardAction: setCard,
}

export default connect(mapStateToProps, mapDispatchToProps)(ManualCardEditor);