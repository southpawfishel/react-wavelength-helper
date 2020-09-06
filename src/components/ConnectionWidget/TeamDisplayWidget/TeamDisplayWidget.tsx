import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../../store/AppStore';
import { Users, User } from '../../../model/Users';
import { List } from 'immutable';
import { Guid } from 'guid-typescript';

interface ITeamDisplayWidgetProps {
  users: Users,
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
    // TODO: set clicked user as clue giver, broadcast to other players
    //alert(`clicked user: ${user.name}`);
  }, []);

  return (
    <div className='container' style={{ maxWidth: '100%' }}>
      <div className='TeamDisplayWidget'>
        <div className='row'>
          <div className='column'>
            <table>
              <thead>
                <tr>
                  <th style={{ color: 'green' }}>Green Team</th>
                  <th style={{ color: 'blue' }}>Blue Team</th>
                </tr>
              </thead>
              <tbody>
                {zipTeams(props.users).map(pair => {
                  return (
                    <tr>
                      {pair[0] !== null ?
                        <td onClick={(e) => handleUserClicked(pair[0])}>{pair[0].name}</td>
                        : <td key={Guid.create().toString()}></td>
                      }
                      {pair[1] !== null ?
                        <td onClick={(e) => handleUserClicked(pair[1])}>{pair[1].name}</td>
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

export default connect(mapStateToProps)(TeamDisplayWidget);