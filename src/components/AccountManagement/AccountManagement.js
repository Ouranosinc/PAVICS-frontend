import React from 'react';
import PropTypes from 'prop-types';
import Paper from'@material-ui/core/Paper';
import classes from './AccountManagement.scss';
import SessionStatus from '../SessionStatus';

export class AccountManagement extends React.Component {
  static propTypes = {
    sessionStatus: PropTypes.any.isRequired,
    sendCredentialsToZiggurat: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
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
