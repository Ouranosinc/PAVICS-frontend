import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AccountManagement from './../../components/AccountManagement';
import {bindActionCreators} from 'redux';
import {actions as sessionActions} from '../../redux/modules/Session';

export class AccountManagementContainer extends React.Component {
  static propTypes = {
    sessionActions: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
  };

  render() {
    return (
      <AccountManagement
        logout={this.props.sessionActions.logout}
        sendCredentialsToZiggurat={this.props.sessionActions.sendCredentialsToZiggurat}
        sessionStatus={this.props.session.sessionStatus} />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    sessionActions: bindActionCreators({...sessionActions}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountManagementContainer);
