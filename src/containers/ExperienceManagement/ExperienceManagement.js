import React from 'react';
import { connect } from 'react-redux';
import ExperienceManagement from './../../components/ExperienceManagement'

export class ExperienceManagementContainer extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <ExperienceManagement {...this.props} />
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
)(ExperienceManagementContainer)
