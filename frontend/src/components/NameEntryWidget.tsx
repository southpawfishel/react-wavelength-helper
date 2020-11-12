import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Users } from '../model/Users';
import { setUserName } from '../store/actions/users-actions';

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
    <div className="container" style={{ maxWidth: '100%' }}>
      <div className="NameEntryWidget">
        <form>
          <label htmlFor="nameInput">Change Username</label>
          <input
            type="text"
            id="nameInput"
            maxLength={32}
            value={users.localUser.name}
            onChange={onNameChanged}
          />
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  users: state.users,
});

const mapDispatchToProps = {
  changeName: setUserName,
};

export default connect(mapStateToProps, mapDispatchToProps)(NameEntryWidget);
