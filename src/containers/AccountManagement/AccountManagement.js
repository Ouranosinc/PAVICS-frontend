import React from 'react';
import { connect } from 'react-redux';
import AccountManagement from './../../components/AccountManagement';

export class AccountManagementContainer extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <AccountManagement {...this.props} />
    )
  }
}

const mapStateToProps = (state) => {
  return {}
};
const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountManagementContainer)
