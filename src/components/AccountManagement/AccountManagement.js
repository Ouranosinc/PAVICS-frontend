import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import classes from './AccountManagement.scss';

export class AccountManagement extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className={classes['AccountManagement']} style={{ margin: 20 }}>
        <Paper>
          AccountManagement (TODO)
        </Paper>
      </div>
    );
  }
}

export default AccountManagement
