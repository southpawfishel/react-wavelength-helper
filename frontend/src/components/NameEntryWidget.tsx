import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Users } from '../model/Users';
import { setUserName } from '../store/actions/users-actions';
import { AlignItems, Layout, Text } from '../ui';
import styled from 'styled-components';

const ScInput = styled.input`
  height: 2rem;
  font-size: 1.1rem;
`;

type INameEntryWidgetProps = {
  users: Users;
  changeName: any;
};

const NameEntryWidget: React.FC<INameEntryWidgetProps> = ({
  users,
  changeName,
}) => {
  const onNameChanged = React.useCallback(
    (event) => {
      changeName(event.target.value);
    },
    [changeName]
  );

  return (
    <Layout
      paddingTop={'2rem'}
      paddingBottom={'1rem'}
      alignItems={AlignItems.Center}
    >
      <Layout paddingRight={'0.5rem'}>
        <Text color={'#333333'}>Change Username</Text>
      </Layout>
      <ScInput
        type="text"
        id="nameInput"
        maxLength={32}
        value={users.localUser.name}
        onChange={onNameChanged}
      />
    </Layout>
  );
};

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
});

const mapDispatchToProps = {
  changeName: setUserName,
};

export default connect(mapStateToProps, mapDispatchToProps)(NameEntryWidget);
