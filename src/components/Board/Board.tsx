import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../store/AppStore';
import BoardCanvas from '../BoardCanvas/BoardCanvas'
import { Card } from '../../model/Card';
import { Answer } from '../../model/Answer';
import { Guess } from '../../model/Guess';
import { nudgeGuessLeft, nudgeGuessRight } from '../../store/actions/guess-actions';

export interface IBoardProps {
  card: Card,
  answer: Answer,
  guess: Guess,
  deck: Card[],
  onLeftArrow: any,
  onRightArrow: any,
}

const Board = (props: IBoardProps) => {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 37) {
      e.preventDefault();
      props.onLeftArrow();
    } else if (e.keyCode === 39) {
      e.preventDefault();
      props.onRightArrow();
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return function cleanup() {
      window.removeEventListener('keydown', onKeyDown);
    };
  })

  return (
    <div className='Board'>
      <BoardCanvas width={768} height={576} />
    </div>
  );
}

const mapStateToProps = (state: IAppState) => ({
  card: state.card,
  answer: state.answer,
  guess: state.guess,
  deck: state.deck
})

const mapDispatchToProps = {
  onLeftArrow: nudgeGuessLeft,
  onRightArrow: nudgeGuessRight,
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);