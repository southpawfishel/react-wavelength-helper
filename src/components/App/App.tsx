import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../store/AppStore';
import Meta from '../Meta/Meta';
import Board from '../Board/Board';
import { BuyGameNotice } from '../BuyGameNotice/BuyGameNotice';
import { Card } from '../../model/Card';
import { Answer } from '../../model/Answer';
import { Guess } from '../../model/Guess';
import '../../index.css';

export interface IProps {
  card: Card,
  answer: Answer,
  guess: Guess,
  deck: Card[]
}

export interface IState {
  card: Card,
  answer: Answer,
  guess: Guess,
  deck: Card[]
}

class App extends React.Component<IProps, IState> {
  public render() {
    return (
      <div className='container'>
        <Meta />
        <div className='App'>
          <BuyGameNotice />
          <Board />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  card: state.card,
  answer: state.answer,
  guess: state.guess,
  deck: state.deck,
})

export default connect(mapStateToProps)(App);