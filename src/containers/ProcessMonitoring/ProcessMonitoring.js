import React from 'react';
import { connect } from 'react-redux';
import ProcessMonitoring from './../../components/ProcessMonitoring';
import { bindActionCreators } from 'redux';
import { actions as layerDatasetActions } from './../../redux/modules/LayerDataset';
import { actions as monitorActions } from './../../redux/modules/Monitor';

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
    layerDatasetActions: bindActionCreators({...layerDatasetActions}, dispatch),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProcessMonitoring)
