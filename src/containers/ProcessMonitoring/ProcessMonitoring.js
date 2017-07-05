import React from 'react';
import { connect } from 'react-redux';
import ProcessMonitoring from './../../components/ProcessMonitoring';

export class ProcessMonitoringContainer extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <ProcessMonitoring {...this.props} />
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
)(ProcessMonitoringContainer)
