import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Users, User, Team } from '../model/Users';
import { List } from 'immutable';
import { Guid } from 'guid-typescript';
import { startRound, syncScores } from '../store/actions/websocket-thunks';
import { clamp } from '../util/mathutil';

interface ITeamDisplayWidgetProps {
  users: Users,
  onStartRound: any,
  onChangeScore: any,
}

const TeamDisplayWidget = (props: ITeamDisplayWidgetProps) => {

  /** Takes online users and adds local user to produce one list of players */
  const makeAllUsersList = (users: Users) => {
    const me = users.localUser.set('name', users.localUser.name + ' (Me)');
    return users.onlineUsers.toList().push(me);
  }

  /** Takes two teams and zips them into tuples for rendering in a table */
  const zipTeams = (users: Users) => {
    const allUsers = makeAllUsersList(users);
    let greenTeam: List<User | null> = allUsers.filter(u => u.team === 'green').sortBy(u => u.name);
    let blueTeam: List<User | null> = allUsers.filter(u => u.team === 'blue').sortBy(u => u.name);
    // Fill in smaller team with null values so zip sees same sized lists
    while (greenTeam.count() < blueTeam.count()) { greenTeam = greenTeam.push(null) }
    while (blueTeam.count() < greenTeam.count()) { blueTeam = blueTeam.push(null) }
    return greenTeam.zip(blueTeam);
  }

  const handleUserClicked = React.useCallback((user: User | null) => {
    if (user === null) {
      return;
    }
    props.onStartRound(user);
  }, [props]);

  /** If user is the clue giver, return style to indicate that condition */
  const getUserStyle = (user: User, props: ITeamDisplayWidgetProps): React.CSSProperties => {
    if (props.users.clueGiverId !== null && user.id === props.users.clueGiverId) {
      return { fontWeight: 'bold', fontStyle: 'italic' }
    }
    return {};
  }

  const setNewScores = React.useCallback((team: Team, score: number) => {
    props.onChangeScore(team, score);
  }, [props]);

  const incrementScore = React.useCallback((team: Team) => {
    setNewScores(team, clamp(props.users.scores.get(team) + 1, 0, 15));
  }, [setNewScores, props]);

  const decrementScore = React.useCallback((team: Team) => {
    setNewScores(team, clamp(props.users.scores.get(team) - 1, 0, 15));
  }, [setNewScores, props]);

  return (
    <div className='container' style={{ maxWidth: '100%' }}>
      <div className='TeamDisplayWidget'>
        <div className='row'>
          <div className='column'>
            <table>
              <thead>
                <tr>
                  <th style={{ color: 'green' }}>{`Green Team ${props.users.localUser.team === 'green' ? '(Your Team)' : ''}`}</th>
                  <th style={{ color: 'blue' }}>{`Blue Team ${props.users.localUser.team === 'blue' ? '(Your Team)' : ''}`}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>
                    <input type='button' value='-' style={{ marginRight: '15px' }} onClick={() => decrementScore('green')} />
                    {`Score: ${props.users.scores.green}`}
                    <input type='button' value='+' style={{ marginLeft: '15px' }} onClick={() => incrementScore('green')} />
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    <input type='button' value='-' style={{ marginRight: '15px' }} onClick={() => decrementScore('blue')} />
                    {`Score: ${props.users.scores.blue}`}
                    <input type='button' value='+' style={{ marginLeft: '15px' }} onClick={() => incrementScore('blue')} />
                  </td>
                </tr>
                {zipTeams(props.users).map(pair => {
                  return (
                    <tr key={Guid.create().toString()}>
                      {pair[0] !== null ?
                        <td style={getUserStyle(pair[0], props)} onClick={(e) => handleUserClicked(pair[0])}>{pair[0].name}</td>
                        : <td key={Guid.create().toString()}></td>
                      }
                      {pair[1] !== null ?
                        <td style={getUserStyle(pair[1], props)} onClick={(e) => handleUserClicked(pair[1])}>{pair[1].name}</td>
                        : <td key={Guid.create().toString()}></td>
                      }
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: IAppState) => ({
  users: state.users
})

const mapDispatchToProps = {
  onStartRound: startRound,
  onChangeScore: syncScores
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamDisplayWidget);