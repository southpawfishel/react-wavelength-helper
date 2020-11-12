import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Users, User, Team } from '../model/Users';
import { List } from 'immutable';
import { Guid } from 'guid-typescript';
import { startRound, syncScores } from '../store/actions/websocket-thunks';
import { clamp } from '../util/mathutil';

type ITeamDisplayWidgetProps = {
  users: Users;
  onStartRound: any;
  onChangeScore: any;
};

const TeamDisplayWidget: React.FC<ITeamDisplayWidgetProps> = ({
  users,
  onStartRound,
  onChangeScore,
}) => {
  /** Takes online users and adds local user to produce one list of players */
  const makeAllUsersList = (users: Users) => {
    const me = users.localUser.set('name', users.localUser.name + ' (Me)');
    return users.onlineUsers.toList().push(me);
  };

  /** Takes two teams and zips them into tuples for rendering in a table */
  const zipTeams = (users: Users) => {
    const allUsers = makeAllUsersList(users);
    let greenTeam: List<User | null> = allUsers
      .filter((u) => u.team === 'green')
      .sortBy((u) => u.name);
    let blueTeam: List<User | null> = allUsers
      .filter((u) => u.team === 'blue')
      .sortBy((u) => u.name);
    // Fill in smaller team with null values so zip sees same sized lists
    while (greenTeam.count() < blueTeam.count()) {
      greenTeam = greenTeam.push(null);
    }
    while (blueTeam.count() < greenTeam.count()) {
      blueTeam = blueTeam.push(null);
    }
    return greenTeam.zip(blueTeam);
  };

  const handleUserClicked = React.useCallback(
    (user: User | null) => {
      if (user === null) {
        return;
      }
      onStartRound(user);
    },
    [onStartRound]
  );

  /** If user is the clue giver, return style to indicate that condition */
  const getUserStyle = (user: User, users: Users): React.CSSProperties => {
    if (users.clueGiverId !== null && user.id === users.clueGiverId) {
      return { fontWeight: 'bold', fontStyle: 'italic' };
    }
    return {};
  };

  const setNewScores = React.useCallback(
    (team: Team, score: number) => {
      onChangeScore(users.scores.set(team, score));
    },
    [onChangeScore, users.scores]
  );

  const incrementScore = React.useCallback(
    (team: Team) => {
      console.log(`scores: ${JSON.stringify(users.scores)}`);
      setNewScores(team, clamp(users.scores.get(team) + 1, 0, 15));
    },
    [setNewScores, users.scores]
  );

  const decrementScore = React.useCallback(
    (team: Team) => {
      setNewScores(team, clamp(users.scores.get(team) - 1, 0, 15));
    },
    [setNewScores, users.scores]
  );

  return (
    <div className="container" style={{ maxWidth: '100%' }}>
      <div className="TeamDisplayWidget">
        <div className="row">
          <div className="column">
            <table>
              <thead>
                <tr>
                  <th style={{ color: 'green' }}>{`Green Team ${
                    users.localUser.team === 'green' ? '(Your Team)' : ''
                  }`}</th>
                  <th style={{ color: 'blue' }}>{`Blue Team ${
                    users.localUser.team === 'blue' ? '(Your Team)' : ''
                  }`}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>
                    <input
                      type="button"
                      value="-"
                      style={{ marginRight: '15px' }}
                      onClick={() => decrementScore('green')}
                    />
                    {`Score: ${users.scores.green}`}
                    <input
                      type="button"
                      value="+"
                      style={{ marginLeft: '15px' }}
                      onClick={() => incrementScore('green')}
                    />
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    <input
                      type="button"
                      value="-"
                      style={{ marginRight: '15px' }}
                      onClick={() => decrementScore('blue')}
                    />
                    {`Score: ${users.scores.blue}`}
                    <input
                      type="button"
                      value="+"
                      style={{ marginLeft: '15px' }}
                      onClick={() => incrementScore('blue')}
                    />
                  </td>
                </tr>
                {zipTeams(users).map((pair) => {
                  return (
                    <tr key={Guid.create().toString()}>
                      {pair[0] !== null ? (
                        <td style={getUserStyle(pair[0], users)}>
                          {pair[0].name}
                          <input
                            type="button"
                            value="set turn"
                            style={{ marginLeft: '10px' }}
                            onClick={() => handleUserClicked(pair[0])}
                          />
                        </td>
                      ) : (
                        <td key={Guid.create().toString()}></td>
                      )}
                      {pair[1] !== null ? (
                        <td style={getUserStyle(pair[1], users)}>
                          {pair[1].name}
                          <input
                            type="button"
                            value="set turn"
                            style={{ marginLeft: '10px' }}
                            onClick={() => handleUserClicked(pair[1])}
                          />
                        </td>
                      ) : (
                        <td key={Guid.create().toString()}></td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
});

const mapDispatchToProps = {
  onStartRound: startRound,
  onChangeScore: syncScores,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamDisplayWidget);
