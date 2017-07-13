import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as projectActionsCreators } from '../../redux/modules/Project';
import { actions as workflowActionsCreators } from './../../redux/modules/Workflow';
import { actions as workflowAPIActionsCreators } from '../../redux/modules/WorkflowAPI';
import WorkflowWizard from './../../components/WorkflowWizard/WorkflowWizard';

export class WorkflowWizardContainer extends React.Component {
  static propTypes = {}

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
    workflowAPI: state.workflowAPI
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators({...projectActionsCreators}, dispatch),
    workflowActions: bindActionCreators({...workflowActionsCreators}, dispatch),
    workflowAPIActions: bindActionCreators({...workflowAPIActionsCreators}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowWizardContainer)
