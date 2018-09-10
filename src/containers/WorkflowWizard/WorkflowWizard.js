import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as jobAPIActions } from '../../redux/modules/JobAPI';
import { actions as projectActions } from '../../redux/modules/Project';
import { actions as workflowActions } from './../../redux/modules/Workflow';
import { actions as workflowAPIActions } from '../../redux/modules/WorkflowAPI';
import WorkflowWizard from './../../components/WorkflowWizard/WorkflowWizard';

const mapStateToProps = (state) => {
  return {
    project: state.project,
    workflow: state.workflow,
    workflowAPI: state.workflowAPI
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    jobAPIActions: bindActionCreators({...jobAPIActions}, dispatch),
    projectActions: bindActionCreators({...projectActions}, dispatch),
    workflowActions: bindActionCreators({...workflowActions}, dispatch),
    workflowAPIActions: bindActionCreators({...workflowAPIActions}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowWizard)
