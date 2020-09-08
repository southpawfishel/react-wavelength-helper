import '../../index.css';
import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../store/AppStore';
import { Users } from '../../model/Users';
import { Deck } from '../../model/Deck';
import { Answer } from '../../model/Answer';
import MetaTags from '../MetaTags/MetaTags';
import Board from '../Board/Board';
import BuyGameHeader from '../BuyGameHeader/BuyGameHeader';
import CardLoadingWidget from '../CardLoadingWidget/CardLoadingWidget';
import AnswerPropertiesWidget from '../AnswerPropertiesWidget/AnswerPropertiesWidget';
import CardPropertiesWidget from '../CardPropertiesWidget/CardPropertiesWidget';
import ConnectionWidget from '../ConnectionWidget/ConnectionWidget';

export interface IProps {
  users: Users,
  answer: Answer,
  deck: Deck
}

export interface IState {
  users: Users,
  answer: Answer,
  deck: Deck
}

class App extends React.Component<IProps, IState> {
  public render() {
    return (
      <div className='container'>
        <MetaTags />
        <div className='App'>
          <BuyGameHeader />
          <ConnectionWidget />
          {this.props.users.connectionStatus === 'connected' ?
            <Board />
            : null}
          <br />
          {this.props.users.connectionStatus === 'connected' ?
            <AnswerPropertiesWidget />
            : null}
          {this.props.users.connectionStatus === 'connected' ?
            <CardPropertiesWidget />
            : null}
          <CardLoadingWidget />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
  answer: state.answer,
  deck: state.deck,
})

export default connect(mapStateToProps)(App);