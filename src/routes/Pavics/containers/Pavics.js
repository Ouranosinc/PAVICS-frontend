import React from 'react';
import {connect} from 'react-redux';
import {WorkflowWizard} from './../../../containers';
import {
  chooseProcess,
  executeProcess,
  fetchProcesses,
  selectWpsProvider
} from './../modules/Pavics';
class Pavics extends React.Component {
  render () {
    return (
      <WorkflowWizard
        {...this.props}
      />
    );
  }
}
const mapActionCreators = {
  chooseProcess,
  executeProcess,
  fetchProcesses,
  selectWpsProvider
};
const mapStateToProps = (state) => {
  return {
    processes: state.pavics.workflowWizard.processes,
    currentStep: state.pavics.workflowWizard.currentStep,
    selectedProcess: state.pavics.workflowWizard.selectedProcess,
    wpsProvider: state.pavics.workflowWizard.wpsProvider
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
