import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Users } from '../model/Users';
import { Deck } from '../model/Deck';
import { Answer } from '../model/Answer';
import MetaTags from './MetaTags';
import Board from './Board';
import BuyGameHeader from './BuyGameHeader';
import CardLoadingWidget from './CardLoadingWidget';
import AnswerPropertiesWidget from './AnswerPropertiesWidget';
import CardPropertiesWidget from './CardPropertiesWidget';
import ConnectionWidget from './ConnectionWidget';
import { FlexDirection, JustifyContent, Layout, Text } from '../ui';

export type IProps = {
  users: Users;
  answer: Answer;
  deck: Deck;
};

export type IState = {
  users: Users;
  answer: Answer;
  deck: Deck;
};

class App extends React.Component<IProps, IState> {
  public render() {
    return (
      <Layout
        background={'#aaaaaa'}
        fullWidth
        fullHeight
        justifyContent={JustifyContent.Center}
      >
        <MetaTags />
        <Layout
          background={'#eeeeee'}
          width="600px"
          padding={'0rem 5rem 5rem 5rem'}
          flexDirection={FlexDirection.Column}
        >
          <BuyGameHeader />
          <ConnectionWidget />
          {this.props.users.connectionStatus === 'connected' && <Board />}
          <Layout paddingBottom={'1rem'}>
            <Text>Debug Options:</Text>
          </Layout>
          {this.props.users.connectionStatus === 'connected' && (
            <AnswerPropertiesWidget />
          )}
          {this.props.users.connectionStatus === 'connected' && (
            <CardPropertiesWidget />
          )}
          <CardLoadingWidget />
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
  answer: state.answer,
  deck: state.deck,
});

export default connect(mapStateToProps)(App);
