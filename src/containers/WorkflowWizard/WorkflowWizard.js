import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as jobAPIActions } from '../../redux/modules/JobAPI';
import { actions as projectActions } from '../../redux/modules/Project';
import { actions as sectionActions } from '../../redux/modules/Section';
import { actions as workflowActions } from './../../redux/modules/Workflow';
import { actions as workflowAPIActions } from '../../redux/modules/WorkflowAPI';
import WorkflowWizard from './../../components/WorkflowWizard/WorkflowWizard';

export class WorkflowWizardContainer extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <WorkflowWizard {...this.props} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    project: state.project,
    workflow: state.workflow,
    workflowAPI: state.workflowAPI,
    visualize: state.visualize
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    jobAPIActions: bindActionCreators({...jobAPIActions}, dispatch),
    projectActions: bindActionCreators({...projectActions}, dispatch),
    sectionActions: bindActionCreators({...sectionActions}, dispatch),
    workflowActions: bindActionCreators({...workflowActions}, dispatch),
    workflowAPIActions: bindActionCreators({...workflowAPIActions}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowWizardContainer)
