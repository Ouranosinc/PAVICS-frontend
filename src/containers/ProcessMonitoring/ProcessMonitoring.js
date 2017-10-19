import React from 'react';
import { connect } from 'react-redux';
import ProcessMonitoring from './../../components/ProcessMonitoring';
import { bindActionCreators } from 'redux';
import { actions as monitorActionsCreators } from './../../redux/modules/Monitor';

export class ProcessMonitoringContainer extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }


  render () {
    console.log('ProcessMonitoring container')
    return (
      <ProcessMonitoring {...this.props} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    monitor: state.monitor,
    project: state.project,
    sessionManagement: state.sessionManagement
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    monitorActions: bindActionCreators({...monitorActionsCreators}, dispatch),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProcessMonitoringContainer)
