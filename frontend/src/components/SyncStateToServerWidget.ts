import * as React from 'react';
import { connect } from 'react-redux';
import { Deck } from '../model/Deck';
import { Users } from '../model/Users';
import { syncUserToServer } from '../store/actions/websocket-thunks';
import { IAppState } from '../store/AppStore';

type ISyncStateToServerWidgetProps = {
  users: Users;
  deck: Deck;
};

/**
 * A component that doesn't render anything to the DOM, just observes when the
 * local state changes and syncs that to the server (if connected) as an effect
 */
const SyncStateToServerWidget: React.FC<ISyncStateToServerWidgetProps> = ({
  users,
}) => {
  React.useEffect(() => {
    syncUserToServer(users.localUser);
  }, [users.localUser]);

  return null;
};

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
  deck: state.deck,
});

export default connect(mapStateToProps)(SyncStateToServerWidget);
