import './BoardCanvas.css'
import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../store/AppStore';
import { Card } from '../../model/Card';
import { Answer } from '../../model/Answer';
import { Guess } from '../../model/Guess';
import { drawBoard } from './BoardRendering'
import { setGuess } from '../../store/actions/guess-actions';

export interface IBoardCanvasProps {
  card: Card,
  answer: Answer,
  guess: Guess,
  width: number,
  height: number,
  onClickToGuess: (guess: Guess) => { type: string, payload: { guess: Guess } }
}

export const BoardCanvas: React.SFC<IBoardCanvasProps> = ({ card, answer, guess, width, height, onClickToGuess }) => {

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(null);

  /** Process mouse/touch coords and converts them to a guess angle value, then broadcast that event */
  const clickToGuess = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (e.target instanceof Element && e.target != null) {

        // TODO: if its my turn to give the clue, I can't move my guess line
        // if (myTurn === true) {
        //   return;
        // }

        e.preventDefault();

        let rect = e.target.getBoundingClientRect();
        var cx, cy;
        if (e instanceof MouseEvent) {
          cx = e.clientX;
          cy = e.clientY;
        } else {
          cx = e.targetTouches[0].clientX;
          cy = e.targetTouches[0].clientY;
        }

        let mx = cx - rect.left;
        let my = cy - rect.top;

        let circleX = width / 2;
        let circleY = height * 0.8;

        let x = mx - circleX;
        let y = Math.max(0, -(my - circleY));

        let newGuess = 1 - Math.abs(Math.atan2(y, x) / Math.PI);
        onClickToGuess(new Guess({ guess: newGuess }));
      }
    },
    [width, height, onClickToGuess]
  );

  /** Hook for mouse dragging events */
  React.useEffect(() => {
    let canvas = canvasRef;

    interface IPointerHandlers {
      down: 'mousedown' | 'touchstart';
      move: 'mousemove' | 'touchmove';
      up: 'mouseup' | 'touchend';
      cancel: 'mouseleave' | 'touchcancel'
    }

    const mouseHandlers: IPointerHandlers = {
      down: 'mousedown',
      move: 'mousemove',
      up: 'mouseup',
      cancel: 'mouseleave'
    };

    const touchHandlers: IPointerHandlers = {
      down: 'touchstart',
      move: 'touchmove',
      up: 'touchend',
      cancel: 'touchcancel'
    }

    // We need to establish handlers for touch and mouse events, so let's make a generic function
    // that takes the event names so we can not copypasta a big block of code twice
    const setupPointerHandlers = (handlers: IPointerHandlers) => {
      // Whenever the user puts their pointer down, start listening for move events and generate
      // guess events in response to the movement.
      // Whenever the pointer leaves the elements or is release, stop listening for those move events.
      const listenForMouseDragEvents = () => {
        canvas.current?.addEventListener(handlers.move, clickToGuess);
      }
      const unlistenForMouseDragEvents = () => {
        canvas.current?.removeEventListener(handlers.move, clickToGuess);
      }
      canvas.current?.addEventListener(handlers.down, listenForMouseDragEvents, false);
      canvas.current?.addEventListener(handlers.cancel, unlistenForMouseDragEvents, false);
      canvas.current?.addEventListener(handlers.up, unlistenForMouseDragEvents, false);

      // Treat initial down clicks as guesses
      canvas.current?.addEventListener(handlers.down, clickToGuess);
    }
    setupPointerHandlers(mouseHandlers);
    setupPointerHandlers(touchHandlers);

    // When cleaning up the component, remove listening for guessing on pointer down
    return function cleanup() {
      canvas.current?.removeEventListener(mouseHandlers.down, clickToGuess);
      canvas.current?.removeEventListener(touchHandlers.down, clickToGuess);
    }

  }, [clickToGuess])

  /** Hook to draw the board to the canvas context using the current props */
  React.useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        setContext(ctx);
      }
    }

    if (context) {
      drawBoard(context, { card, answer, guess, width, height, onClickToGuess });
    }
  }, [context, card, answer, guess, width, height, onClickToGuess])

  /** Hook to update the context for retina support if available */
  React.useEffect(() => {
    if (canvasRef.current) {
      const updateContentScale = (canvas: HTMLCanvasElement) => {
        var contentScale = window.devicePixelRatio;
        if (contentScale !== 1) {
          canvas.style.width = canvas.width + 'px';
          canvas.style.height = canvas.height + 'px';

          canvas.width = canvas.width * contentScale;
          canvas.height = canvas.height * contentScale;

          var ctx = canvas.getContext('2d');
          ctx?.scale(contentScale, contentScale);
        }
      }
      updateContentScale(canvasRef.current);
    }
  }, [])

  return (
    <div className='container'>
      <div className='BoardCanvasDiv'>
        <canvas className='BoardCanvas' ref={canvasRef} width={width} height={height}>
          Bummer, your browser doesn't support HTML5 canvas <span role='img' aria-label='crying face emoji'>😭</span>
        </canvas>
      </div>
    </div>
  );
}

const mapStateToProps = (state: IAppState) => ({
  card: state.card,
  answer: state.answer,
  guess: state.guess,
})

const mapDispatchToProps = {
  onClickToGuess: setGuess,
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardCanvas);