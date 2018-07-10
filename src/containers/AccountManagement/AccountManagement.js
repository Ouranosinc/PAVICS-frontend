import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AccountManagement from './../../components/AccountManagement';
import {bindActionCreators} from 'redux';
import {actions as sessionManagement} from '../../redux/modules/SessionManagement';

export class AccountManagementContainer extends React.Component {
  static propTypes = {
    accountManagementActions: PropTypes.object.isRequired,
    sessionManagement: PropTypes.object.isRequired,
  };

  render() {
    return (
      <AccountManagement
        logout={this.props.accountManagementActions.logout}
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
    accountManagementActions: bindActionCreators({...sessionManagement}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountManagementContainer);
