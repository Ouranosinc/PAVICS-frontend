import React from 'react';
import {connect} from 'react-redux';
import AccountManagement from './../../components/AccountManagement';
import {bindActionCreators} from 'redux';
import {actions as accountManagementActionsCreators} from '../../redux/modules/SessionManagement';

export class AccountManagementContainer extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.props.accountManagementActions.checkLogin();
  }

  render() {
    return (
      <AccountManagement
        sendCredentialsToZiggurat={this.props.accountManagementActions.sendCredentialsToZiggurat}
        sessionStatus={this.props.sessionManagement.sessionStatus} />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sessionManagement: state.sessionManagement,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    accountManagementActions: bindActionCreators({...accountManagementActionsCreators}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountManagementContainer);
