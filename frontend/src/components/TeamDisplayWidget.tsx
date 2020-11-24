import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Users, User, Team } from '../model/Users';
import { startRound, syncScores } from '../store/actions/websocket-thunks';
import { clamp } from '../util/mathutil';
import {
  AlignItems,
  Button,
  FlexDirection,
  JustifyContent,
  Layout,
  Text,
} from '../ui';
import { FaUserClock, FaPlus, FaMinus } from 'react-icons/fa';
import { ImCheckmark } from 'react-icons/im';

const capitalizeFirstLetter = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

type TeamNameProps = {
  team: Team;
  localUser: User;
};

/**
 * Component that draws a team name
 */
const TeamName: React.FC<TeamNameProps> = ({ team, localUser }) => {
  return (
    <Layout paddingBottom={'1rem'} justifyContent={JustifyContent.Center}>
      <Text color={team} fontSize={'1.3rem'} fontWeight={'500'}>
        {`${capitalizeFirstLetter(team)} Team ${
          localUser.team === team ? '(Your Team)' : ''
        }`}
      </Text>
    </Layout>
  );
};

type ScoresWidgetProps = {
  team: Team;
  score: number;
  incrementScore: any;
  decrementScore: any;
};

/**
 * Component that handles changing the score for a team
 */
const ScoresWidget: React.FC<ScoresWidgetProps> = ({
  team,
  score,
  incrementScore,
  decrementScore,
}) => {
  return (
    <Layout
      flexDirection={FlexDirection.Row}
      justifyContent={JustifyContent.Center}
      paddingBottom={'1rem'}
    >
      <Button
        width={'3rem'}
        height={'3rem'}
        padding={'0rem 0rem 0rem 0rem'}
        background={'purple'}
        onClick={() => decrementScore(team)}
      >
        <FaMinus color={'white'} size={'1.5rem'} />
      </Button>
      <Layout
        flexDirection={FlexDirection.Column}
        justifyContent={JustifyContent.Center}
        margin={'0rem 1rem'}
      >
        <Text color={'#333333'} fontSize={'1.2rem'}>
          {`Score: ${score}`}
        </Text>
      </Layout>
      <Button
        width={'3rem'}
        height={'3rem'}
        padding={'0rem 0rem 0rem 0rem'}
        background={'purple'}
        onClick={() => incrementScore(team)}
      >
        <FaPlus color={'white'} size={'1.5rem'} />
      </Button>
    </Layout>
  );
};

/** Takes online users and adds local user to produce one list of players */
const makeAllUsersList = (users: Users) => {
  const me = users.localUser.set('name', users.localUser.name + ' (Me)');
  return users.onlineUsers.toList().push(me);
};

/** Tells us if a user is the clue giver */
const isUserClueGiver = (user: User, users: Users) => {
  return users.clueGiverId !== null && user.id === users.clueGiverId;
};

type TeamMemberListProps = {
  team: Team;
  users: Users;
  onStartTurnClicked: any;
};

/**
 * Component that draws the list of players on a team
 */
const TeamMemberList: React.FC<TeamMemberListProps> = ({
  team,
  users,
  onStartTurnClicked,
}) => {
  return (
    <Layout flexDirection={FlexDirection.Column}>
      {makeAllUsersList(users)
        .filter((u) => u.team === team)
        .map((u) => (
          <Layout
            height={'2rem'}
            paddingBottom={'1rem'}
            flexDirection={FlexDirection.Row}
            alignItems={AlignItems.Center}
          >
            {isUserClueGiver(u, users) ? (
              <Layout paddingRight={'0.5rem'}>
                <ImCheckmark color={u.team!} size={'1.5rem'} />
              </Layout>
            ) : (
              <Button
                padding={'0.2rem 0.3rem'}
                marginRight={'0.5rem'}
                background={'purple'}
                onClick={() => onStartTurnClicked(u)}
              >
                <FaUserClock color={'white'} size={'1.5rem'} />
              </Button>
            )}
            <Text
              color={'#333333'}
              fontStyle={isUserClueGiver(u, users) ? 'italic' : undefined}
              fontWeight={isUserClueGiver(u, users) ? '700' : undefined}
            >
              {u.name}
            </Text>
          </Layout>
        ))}
    </Layout>
  );
};

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
  const startTurnForUser = React.useCallback(
    (user: User | null) => {
      if (user === null) {
        return;
      }
      onStartRound(user);
    },
    [onStartRound]
  );

  const setNewScores = React.useCallback(
    (team: Team, score: number) => {
      onChangeScore(users.scores.set(team, score));
    },
    [onChangeScore, users.scores]
  );

  const incrementScore = React.useCallback(
    (team: Team) => {
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
    <Layout fullWidth paddingBottom={'1rem'} paddingTop={'1rem'}>
      <Layout flexDirection={FlexDirection.Column} width={'50%'}>
        <TeamName team={'green'} localUser={users.localUser} />
        <ScoresWidget
          team={'green'}
          score={users.scores.green}
          incrementScore={incrementScore}
          decrementScore={decrementScore}
        />
        <TeamMemberList
          team={'green'}
          users={users}
          onStartTurnClicked={startTurnForUser}
        />
      </Layout>
      <Layout flexDirection={FlexDirection.Column} width={'50%'}>
        <TeamName team={'blue'} localUser={users.localUser} />
        <ScoresWidget
          team={'blue'}
          score={users.scores.blue}
          incrementScore={incrementScore}
          decrementScore={decrementScore}
        />
        <TeamMemberList
          team={'blue'}
          users={users}
          onStartTurnClicked={startTurnForUser}
        />
      </Layout>
    </Layout>
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
