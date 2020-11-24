import * as React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { IAppState } from '../store/AppStore';
import BoardCanvas from './BoardCanvas';
import { Deck } from '../model/Deck';
import { Answer } from '../model/Answer';
import {
  nudgeGuessLeft,
  nudgeGuessRight,
  setShownTeam,
} from '../store/actions/users-actions';
import { Users, Team, isLocalUserClueGiver } from '../model/Users';
import { revealAnswer } from '../store/actions/websocket-thunks';
import SyncStateToServerWidget from './SyncStateToServerWidget';
import { Button, FlexDirection, JustifyContent, Layout, Text } from '../ui';

type ShowTeamWidgetProps = {
  shownTeam: Team;
  onClickTeam: any;
};

/**
 * Component that allows the user to toggle which team's guesses are visible
 */
const ShowTeamWidget: React.FC<ShowTeamWidgetProps> = ({
  shownTeam,
  onClickTeam,
}) => {
  return (
    <Layout justifyContent={JustifyContent.Center} paddingBottom={'0.5rem'}>
      {shownTeam === 'green' ? (
        <Button background={'blue'} onClick={() => onClickTeam('blue')}>
          <Text color={'white'}>Show Blue</Text>
        </Button>
      ) : (
        <Button background={'green'} onClick={() => onClickTeam('green')}>
          <Text color={'white'}>Show Green</Text>
        </Button>
      )}
    </Layout>
  );
};

export type IBoardProps = {
  users: Users;
  answer: Answer;
  deck: Deck;
  onLeftArrow: any;
  onRightArrow: any;
  onShowTeam: any;
  onRevealAnswer: any;
};

type RevealAnswerWidgetProps = {
  onClickReveal: any;
};

const RevealAnswerWidget: React.FC<RevealAnswerWidgetProps> = ({
  onClickReveal,
}) => {
  return (
    <Layout justifyContent={JustifyContent.Center}>
      <Button background={'purple'} onClick={onClickReveal}>
        <Text color={'white'}>Reveal Answer</Text>
      </Button>
    </Layout>
  );
};

const Board: React.FC<IBoardProps> = ({
  users,
  answer,
  deck,
  onLeftArrow,
  onRightArrow,
  onShowTeam,
  onRevealAnswer,
}) => {
  const [size /*setSize*/] = React.useState(Map({ width: 600, height: 450 }));

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
        onLeftArrow();
      } else if (e.keyCode === 39) {
        e.preventDefault();
        onRightArrow();
      }
    };

    // Register keyboard handler, unregister when effect is cleaned up
    window.addEventListener('keydown', onKeyDown);
    return function cleanup() {
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  const showTeam = React.useCallback(
    (team: Team) => {
      onShowTeam(team);
    },
    [onShowTeam]
  );

  const revealAnswer = React.useCallback(() => {
    onRevealAnswer(answer);
  }, [onRevealAnswer, answer]);

  return (
    <Layout flexDirection={FlexDirection.Column}>
      <SyncStateToServerWidget />
      <ShowTeamWidget shownTeam={users.shownTeam} onClickTeam={showTeam} />
      <BoardCanvas
        width={size.get('width', 600)}
        height={size.get('height', 450)}
      />
      <br />
      {isLocalUserClueGiver(users) ? (
        <RevealAnswerWidget onClickReveal={revealAnswer} />
      ) : null}
    </Layout>
  );
};

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
  answer: state.answer,
  deck: state.deck,
});

const mapDispatchToProps = {
  onLeftArrow: nudgeGuessLeft,
  onRightArrow: nudgeGuessRight,
  onShowTeam: setShownTeam,
  onRevealAnswer: revealAnswer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
