import * as React from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import { IAppState } from "../store/AppStore";
import BoardCanvas from "./BoardCanvas";
import { Deck } from "../model/Deck";
import { Answer } from "../model/Answer";
import {
  nudgeGuessLeft,
  nudgeGuessRight,
  setShownTeam,
} from "../store/actions/users-actions";
import { Users, Team, isLocalUserClueGiver } from "../model/Users";
import { revealAnswer } from "../store/actions/websocket-thunks";

export interface IBoardProps {
  users: Users;
  answer: Answer;
  deck: Deck;
  onLeftArrow: any;
  onRightArrow: any;
  onShowTeam: any;
  onRevealAnswer: any;
}

const Board = (props: IBoardProps) => {
  const [size /*setSize*/] = React.useState(Map({ width: 768, height: 576 }));

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
    };

    window.addEventListener("keydown", onKeyDown);
    return function cleanup() {
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  const showTeam = React.useCallback(
    (team: Team) => {
      props.onShowTeam(team);
    },
    [props]
  );

  const revealAnswer = React.useCallback(() => {
    props.onRevealAnswer(props.answer);
  }, [props]);

  return (
    <div className="Board" id="Board" style={{ width: "100%" }}>
      <form>
        <div className="row">
          <div className="column column-50 column-offset-25">
            {props.users.shownTeam === "green" ? (
              <input
                type="button"
                style={{
                  backgroundColor: "blue",
                  borderColor: "blue",
                  width: "100%",
                }}
                value="Show Blue"
                onClick={() => showTeam("blue")}
              />
            ) : (
              <input
                type="button"
                style={{
                  backgroundColor: "green",
                  borderColor: "green",
                  width: "100%",
                }}
                value="Show Green"
                onClick={() => showTeam("green")}
              />
            )}
          </div>
        </div>
      </form>
      <BoardCanvas
        width={size.get("width", 768)}
        height={size.get("height", 576)}
      />
      <br />
      {isLocalUserClueGiver(props.users) ? (
        <div className="row">
          <div className="column column-50 column-offset-25">
            <input
              type="button"
              style={{ width: "100%" }}
              value="Reveal Answer"
              onClick={revealAnswer}
            />
          </div>
        </div>
      ) : null}
    </div>
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
