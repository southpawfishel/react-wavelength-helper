import * as React from 'react';
import { connect } from 'react-redux';
import { connectSocket } from '../store/actions/websocket-thunks';
import { loadDeckFromRemote } from '../store/actions/deck-thunks';

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
    <div className="container" style={{ maxWidth: '100%' }}>
      <div className="ConnectWithTeamWidget">
        <form>
          <div className="row">
            <div className="column column-50">
              <input
                type="button"
                style={{
                  backgroundColor: 'green',
                  borderColor: 'green',
                  width: '100%',
                }}
                value="Join Green Team"
                onClick={onConnectGreen}
              />
            </div>
            <div className="column column-50">
              <input
                type="button"
                style={{
                  backgroundColor: 'blue',
                  borderColor: 'blue',
                  width: '100%',
                }}
                className="button-blue"
                value="Join Blue Team"
                onClick={onConnectBlue}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
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
