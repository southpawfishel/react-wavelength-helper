import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { IAppState } from '../../store/AppStore';
import Meta from '../Meta/Meta';
import Board from '../Board/Board';
import { BuyGameNotice } from '../BuyGameNotice/BuyGameNotice';
import { Card } from '../../model/Card';
import { Answer } from '../../model/Answer';
import { Guess } from '../../model/Guess';
import '../../index.css';
import CardLoadingForm from '../CardLoadingForm/CardLoadingForm';
import ManualCardEditor from '../ManualCardEditor/ManualCardEditor';
import AnswerPropertiesWidget from '../AnswerPropertiesWidget/AnswerPropertiesWidget';

export interface IProps {
  card: Card,
  answer: Answer,
  guess: Guess,
  deck: List<Card>
}

export interface IState {
  card: Card,
  answer: Answer,
  guess: Guess,
  deck: List<Card>
}

class App extends React.Component<IProps, IState> {
  public render() {
    return (
      <div className='container'>
        <Meta />
        <div className='App'>
          <BuyGameNotice />
          <Board />
          <br />
          <AnswerPropertiesWidget />
          <ManualCardEditor />
          <br />
          <CardLoadingForm />
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