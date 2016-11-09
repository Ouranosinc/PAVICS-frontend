import React from 'react';
import {connect} from 'react-redux';
import {WorkflowWizard} from './../../../containers';
import * as constants from './../../../constants';
import {
  chooseProcess
} from './../modules/Pavics';
class Pavics extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    currentStep: React.PropTypes.string.isRequired
  };
  makeSection () {
    switch (this.props.currentStep) {
      case constants.WORKFLOW_STEP_PROCESS:
        return (
          <WorkflowWizard
            processes={this.props.processes}
            chooseProcess={this.props.chooseProcess}
          />
        );
      case constants.WORKFLOW_STEP_INPUTS:
        return (
          <div>inputs step</div>
        );
    }
  }
  render () {
    return this.makeSection();
  }
}
const mapActionCreators = {
  chooseProcess
};
const mapStateToProps = (state) => {
  return {
    processes: state.pavics.processes,
    currentStep: state.pavics.workflowWizard.currentStep
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
