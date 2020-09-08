import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../store/AppStore';
import { connectSocket } from '../../store/actions/users-thunks'
import { Users, ConnectionStatus } from '../../model/Users';
import SyncUserToServerWidget from './SyncUserToServerWidget'
import ConnectWithTeamWidget from './ConnectWithTeamWidget/ConnectWithTeamWidget';
import TeamDisplayWidget from './TeamDisplayWidget/TeamDisplayWidget';

interface IConnectionWidgetProps {
  users: Users,
  onConnect: any,
}

const ConnectionWidget = (props: IConnectionWidgetProps) => {
  const GetConnectionStatus = (state: ConnectionStatus) => {
    switch (state) {
      case 'not_connected':
        return 'Not connected to server.';
      case 'connecting':
        return 'Connecting to server...';
      case 'connected':
        return 'Connected to server. Click a player name to start a new round.'
    }
  }

  return (
    <div className='container' style={{ maxWidth: '100%' }}>
      <SyncUserToServerWidget />
      <div className='ConnectionWidget'>
        <div className='row'>
          <div className='column'>
            {GetConnectionStatus(props.users.connectionStatus)}
          </div>
        </div>
        {props.users.connectionStatus === 'not_connected' ?
          <ConnectWithTeamWidget />
          : null}
        {props.users.connectionStatus === 'connected' ?
          <TeamDisplayWidget />
          : null}
      </div>
    </div>
  );
}

const mapStateToProps = (state: IAppState) => ({
  users: state.users
})

const mapDispatchToProps = {
  onConnect: connectSocket
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionWidget);