import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Deck } from '../model/Deck';
import { Answer } from '../model/Answer';
import { Users, isLocalUserClueGiver } from '../model/Users';
import { drawBoard } from './BoardRendering';
import { setGuess } from '../store/actions/users-actions';
import styled from 'styled-components';
import { Layout } from '../ui';

export type IBoardCanvasProps = {
  users: Users;
  answer: Answer;
  deck: Deck;
  width: number;
  height: number;
  onClickToGuess: typeof setGuess;
};

const ScBoardCanvas = styled.canvas`
  background: #595959;
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

export const BoardCanvas: React.FC<IBoardCanvasProps> = ({
  users,
  deck,
  answer,
  width,
  height,
  onClickToGuess,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(
    null
  );

  /** Process mouse/touch coords and converts them to a guess angle value, then broadcast that event */
  const clickToGuess = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (e.target instanceof Element && e.target != null) {
        // If its my turn to give the clue, I can't move my guess line
        if (isLocalUserClueGiver(users)) {
          return;
        }

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
        onClickToGuess(newGuess);
      }
    },
    [width, height, onClickToGuess, users]
  );

  /** Hook for mouse dragging events */
  React.useEffect(() => {
    let canvas = canvasRef;

    type IPointerHandlers = {
      down: 'mousedown' | 'touchstart';
      move: 'mousemove' | 'touchmove';
      up: 'mouseup' | 'touchend';
      cancel: 'mouseleave' | 'touchcancel';
    };

    const mouseHandlers: IPointerHandlers = {
      down: 'mousedown',
      move: 'mousemove',
      up: 'mouseup',
      cancel: 'mouseleave',
    };

    const touchHandlers: IPointerHandlers = {
      down: 'touchstart',
      move: 'touchmove',
      up: 'touchend',
      cancel: 'touchcancel',
    };

    // We need to establish handlers for touch and mouse events, so let's make a generic function
    // that takes the event names so we can not copypasta a big block of code twice
    const setupPointerHandlers = (handlers: IPointerHandlers) => {
      // Whenever the user puts their pointer down, start listening for move events and generate
      // guess events in response to the movement.
      // Whenever the pointer leaves the elements or is release, stop listening for those move events.
      const listenForMouseDragEvents = () => {
        canvas.current?.addEventListener(handlers.move, clickToGuess);
      };
      const unlistenForMouseDragEvents = () => {
        canvas.current?.removeEventListener(handlers.move, clickToGuess);
      };
      canvas.current?.addEventListener(
        handlers.down,
        listenForMouseDragEvents,
        false
      );
      canvas.current?.addEventListener(
        handlers.cancel,
        unlistenForMouseDragEvents,
        false
      );
      canvas.current?.addEventListener(
        handlers.up,
        unlistenForMouseDragEvents,
        false
      );

      // Treat initial down clicks as guesses
      canvas.current?.addEventListener(handlers.down, clickToGuess);
    };
    setupPointerHandlers(mouseHandlers);
    setupPointerHandlers(touchHandlers);

    // When cleaning up the component, remove listening for guessing on pointer down
    return function cleanup() {
      canvas.current?.removeEventListener(mouseHandlers.down, clickToGuess);
      canvas.current?.removeEventListener(touchHandlers.down, clickToGuess);
    };
  }, [clickToGuess]);

  /** Hook to draw the board to the canvas context using the current props */
  React.useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        setContext(ctx);
      }
    }

    if (context) {
      drawBoard(context, { users, deck, answer, width, height });
    }
  }, [context, users, deck, answer, width, height, onClickToGuess]);

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
      };
      updateContentScale(canvasRef.current);
    }
  }, []);

  return (
    <Layout>
      <ScBoardCanvas ref={canvasRef} width={width} height={height}>
        Bummer, your browser doesn't support HTML5 canvas{' '}
        <span role="img" aria-label="crying face emoji">
          😭
        </span>
      </ScBoardCanvas>
    </Layout>
  );
};

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
  deck: state.deck,
  answer: state.answer,
});

const mapDispatchToProps = {
  onClickToGuess: setGuess,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardCanvas);
