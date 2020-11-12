import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Users, ConnectionStatus } from '../model/Users';
import SyncStateToServerWidget from './SyncStateToServerWidget';
import ConnectWithTeamWidget from './ConnectWithTeamWidget';
import TeamDisplayWidget from './TeamDisplayWidget';
import NameEntryWidget from './NameEntryWidget';

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
    <div className="container" style={{ maxWidth: '100%' }}>
      <SyncStateToServerWidget />
      <div className="ConnectionWidget">
        <div className="row">
          <div className="column">
            {GetConnectionStatus(users.connectionStatus)}
          </div>
        </div>
        {users.connectionStatus === 'not_connected' ? (
          <ConnectWithTeamWidget />
        ) : null}
        <br />
        {users.connectionStatus === 'connected' ? <NameEntryWidget /> : null}
        {users.connectionStatus === 'connected' ? <TeamDisplayWidget /> : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
});

export default connect(mapStateToProps)(ConnectionWidget);
