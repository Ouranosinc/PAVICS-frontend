import React from 'react';
import Paper from 'material-ui/Paper';
import classes from './AccountManagement.scss';
import SessionStatus from '../SessionStatus';

export class AccountManagement extends React.Component {
  static propTypes = {
    sessionStatus: React.PropTypes.any.isRequired,
    sendCredentialsToZiggurat: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  makeZigguratLoginRequest = (username, password) => {
    this.props.sendCredentialsToZiggurat(username, password);
  };

  render () {
    return (
      <div className={classes['AccountManagement']} style={{ margin: 20 }}>
        <Paper style={{padding: 30}}>
          <SessionStatus
            logout={this.props.logout}
            makeZigguratLoginRequest={this.makeZigguratLoginRequest}
            sessionStatus={this.props.sessionStatus} />
        </Paper>
      </div>
    );
  }
}

export default AccountManagement
