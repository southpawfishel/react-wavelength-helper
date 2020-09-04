import '../../index.css';
import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { IAppState } from '../../store/AppStore';
import { Users } from '../../model/Users';
import { Card } from '../../model/Card';
import { Answer } from '../../model/Answer';
import Meta from '../Meta/Meta';
import Board from '../Board/Board';
import BuyGameNotice from '../BuyGameNotice/BuyGameNotice';
import CardLoadingForm from '../CardLoadingForm/CardLoadingForm';
import AnswerPropertiesWidget from '../AnswerPropertiesWidget/AnswerPropertiesWidget';
import CardPropertiesWidget from '../CardPropertiesWidget/CardPropertiesWidget';

export interface IProps {
  users: Users,
  card: Card,
  answer: Answer,
  deck: List<Card>
}

export interface IState {
  users: Users,
  card: Card,
  answer: Answer,
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
          <CardPropertiesWidget />
          <CardLoadingForm />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
  card: state.card,
  answer: state.answer,
  deck: state.deck,
})

export default connect(mapStateToProps)(App);