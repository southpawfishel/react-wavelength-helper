import * as React from 'react';
import { connect } from 'react-redux';
import { Users } from '../../model/Users';
import { syncUserToServer } from '../../store/actions/users-thunks';
import { IAppState } from '../../store/AppStore';

/**
 * A component that doesn't render anything, just observes when the local
 * user prop changes and syncs that to the server (if connected) as an effect
 * TODO: This should probably be a middleware or built into the reducer?
 */
const SyncUserToServerWidget = (props: { users: Users }) => {
  React.useEffect(() => {
    syncUserToServer(props.users.localUser);
  }, [props.users.localUser])

  return (null);
}

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
})

export default connect(mapStateToProps)(SyncUserToServerWidget);