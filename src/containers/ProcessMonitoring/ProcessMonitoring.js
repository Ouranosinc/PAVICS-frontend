import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProcessMonitoring from './../../components/ProcessMonitoring';
import { bindActionCreators } from 'redux';
import { actions as monitorActions } from './../../redux/modules/Monitor';
import { actions as visualizeActions } from './../../redux/modules/Visualize';

export class ProcessMonitoringContainer extends React.Component {
  static propTypes = {};

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
    session: state.session
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    monitorActions: bindActionCreators({...monitorActions}, dispatch),
    visualizeActions: bindActionCreators({...visualizeActions}, dispatch),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProcessMonitoringContainer)
