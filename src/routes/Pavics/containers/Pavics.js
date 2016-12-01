import React from 'react';
import {connect} from 'react-redux';
import {WorkflowWizard} from './../../../containers';
import {
  chooseProcess,
  executeProcess,
  fetchProcesses,
  selectWpsProvider,
  fetchProcessInputs,
  handleSelectedProcessValueChange,
  fetchProviders
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
  fetchProviders,
  selectWpsProvider,
  fetchProcessInputs,
  handleSelectedProcessValueChange
};
const mapStateToProps = (state) => {
  return {
    processes: state.pavics.workflowWizard.processes,
    currentStep: state.pavics.workflowWizard.currentStep,
    selectedProcess: state.pavics.workflowWizard.selectedProcess,
    selectedProcessInputs: state.pavics.workflowWizard.selectedProcessInputs,
    selectedProcessValues: state.pavics.workflowWizard.selectedProcessValues,
    providers: state.pavics.workflowWizard.providers
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
