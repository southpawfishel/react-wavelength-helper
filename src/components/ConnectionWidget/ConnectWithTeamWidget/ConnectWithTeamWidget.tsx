import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../../store/AppStore';
import { connectSocket } from '../../../store/actions/websocket-thunks'
import { Users } from '../../../model/Users';

interface IConnectWithTeamWidgetProps {
  users: Users,
  onConnect: any,
}

const ConnectWithTeamWidget = (props: IConnectWithTeamWidgetProps) => {
  const connect = React.useCallback((team: 'green' | 'blue') => {
    props.onConnect(team);
  }, [props]);

  const onConnectGreen = React.useCallback((event) => {
    connect('green');
  }, [connect]);

  const onConnectBlue = React.useCallback((event) => {
    connect('blue');
  }, [connect]);

  return (
    <div className='container' style={{ maxWidth: '100%' }}>
      <div className='ConnectWithTeamWidget'>
        <form>
          <div className='row'>
            <div className='column column-50'>
              <input type='button' style={{ backgroundColor: 'green', borderColor: 'green', width: '100%' }} value='Join Green Team' onClick={onConnectGreen} />
            </div>
            <div className='column column-50'>
              <input type='button' style={{ backgroundColor: 'blue', borderColor: 'blue', width: '100%' }} className='button-blue' value='Join Blue Team' onClick={onConnectBlue} />
            </div>
          </div>
        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConnectWithTeamWidget);