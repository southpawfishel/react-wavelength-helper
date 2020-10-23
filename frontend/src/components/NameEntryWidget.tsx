import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../store/AppStore";
import { Users } from "../model/Users";
import { setUserName } from "../store/actions/users-actions";

interface INameEntryWidgetProps {
  users: Users;
  changeName: any;
}

const NameEntryWidget = (props: INameEntryWidgetProps) => {
  const onNameChanged = React.useCallback(
    (event) => {
      props.changeName(event.target.value);
    },
    [props]
  );

  return (
    <div className="container" style={{ maxWidth: "100%" }}>
      <div className="NameEntryWidget">
        <form>
          <label htmlFor="nameInput">Change Username</label>
          <input
            type="text"
            id="nameInput"
            value={props.users.localUser.name}
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
