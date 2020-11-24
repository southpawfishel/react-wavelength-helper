import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Users, ConnectionStatus } from '../model/Users';
import ConnectWithTeamWidget from './ConnectWithTeamWidget';
import TeamDisplayWidget from './TeamDisplayWidget';
import NameEntryWidget from './NameEntryWidget';
import { FlexDirection, Layout, Text } from '../ui';

type IConnectionWidgetProps = {
  users: Users;
};

const ConnectionWidget: React.FC<IConnectionWidgetProps> = ({ users }) => {
  const GetConnectionStatus = (state: ConnectionStatus) => {
    switch (state) {
      case 'not_connected':
        return 'Not connected to server.';
      case 'connecting':
        return 'Connecting to server...';
      case 'connected':
        return 'Connected to server. Click a player name to start a new round.';
    }
  };

  return (
    <Layout flexDirection={FlexDirection.Column}>
      <Layout>
        <Text fontWeight={'500'} color={'#333333'}>
          {GetConnectionStatus(users.connectionStatus)}
        </Text>
      </Layout>
      {users.connectionStatus === 'not_connected' && <ConnectWithTeamWidget />}
      {users.connectionStatus === 'connected' && (
        <Layout flexDirection={FlexDirection.Column}>
          <NameEntryWidget />
          <TeamDisplayWidget />
        </Layout>
      )}
    </Layout>
  );
};

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
});

export default connect(mapStateToProps)(ConnectionWidget);
