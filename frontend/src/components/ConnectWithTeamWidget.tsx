import * as React from 'react';
import { connect } from 'react-redux';
import { connectSocket } from '../store/actions/websocket-thunks';
import { loadDeckFromRemote } from '../store/actions/deck-thunks';
import { Button, JustifyContent, Layout, Text } from '../ui';

type IConnectWithTeamWidgetProps = {
  onConnect: any;
  fetchDeck: any;
};

const ConnectWithTeamWidget: React.FC<IConnectWithTeamWidgetProps> = ({
  onConnect,
  fetchDeck,
}) => {
  const connect = React.useCallback(
    (team: 'green' | 'blue') => {
      onConnect(team);
      fetchDeck();
    },
    [onConnect, fetchDeck]
  );

  const onConnectGreen = React.useCallback(() => {
    connect('green');
  }, [connect]);

  const onConnectBlue = React.useCallback(() => {
    connect('blue');
  }, [connect]);

  return (
    <Layout
      paddingBottom={'1rem'}
      paddingTop={'1rem'}
      justifyContent={JustifyContent.SpaceAround}
    >
      <Button background={'green'} width={'15rem'} onClick={onConnectGreen}>
        <Text color={'white'} fontSize={'1.2rem'}>
          Join Green Team
        </Text>
      </Button>
      <Button background={'blue'} width={'15rem'} onClick={onConnectBlue}>
        <Text color={'white'} fontSize={'1.2rem'}>
          Join Blue Team
        </Text>
      </Button>
    </Layout>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onConnect: connectSocket,
  fetchDeck: loadDeckFromRemote,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectWithTeamWidget);
