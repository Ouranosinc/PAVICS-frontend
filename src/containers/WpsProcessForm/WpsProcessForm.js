import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import WpsProcessForm from './../../components/WpsProcessForm';
import { actions as sectionActions } from '../../redux/modules/Section';
import { actions as workflowActions } from './../../redux/modules/Workflow';

const mapStateToProps = (state) => {
  return {
    layerDataset: state.layerDataset,
    layerRegion: state.layerRegion,
    workflow: state.workflow
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    sectionActions: bindActionCreators({...sectionActions}, dispatch),
    workflowActions: bindActionCreators({...workflowActions}, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WpsProcessForm)
