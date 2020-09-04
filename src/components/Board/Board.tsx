import * as React from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
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
  deck: List<Card>,
  onLeftArrow: any,
  onRightArrow: any,
}

const Board = (props: IBoardProps) => {
  const [size, setSize] = React.useState(Map({ width: 768, height: 576 }));

  React.useEffect(() => {
    // TODO: Figure out if there's a good way to resize the canvas on mobile portrait
    // while keeping size the same on desktop

    // let board = document.getElementById('Board');
    // let canvas = document.getElementById('BoardCanvas');
    // if (board !== null && canvas !== null) {
    //   let bw = board.clientWidth;
    //   let cw = canvas.clientWidth;
    //   let ch = canvas.clientHeight;
    //   if (cw > bw) {
    //     let ratio = ch / cw;
    //     let newH = bw * ratio;
    //     setSize(Map({ width: bw, height: newH }));
    //   }
    // }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 37) {
        e.preventDefault();
        props.onLeftArrow();
      } else if (e.keyCode === 39) {
        e.preventDefault();
        props.onRightArrow();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return function cleanup() {
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <div className='Board' id='Board' style={{ width: '100%' }}>
      <BoardCanvas width={size.get('width', 768)} height={size.get('height', 576)} />
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