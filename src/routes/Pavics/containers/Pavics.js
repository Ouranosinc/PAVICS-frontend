import React from 'react';
import {connect} from 'react-redux';
import {WorkflowWizard} from './../../../containers';
import {
  chooseProcess,
  executeProcess
} from './../modules/Pavics';
class Pavics extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    currentStep: React.PropTypes.string.isRequired,
    selectedProcess: React.PropTypes.object.isRequired,
    executeProcess: React.PropTypes.func.isRequired
  };
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
  executeProcess
};
const mapStateToProps = (state) => {
  return {
    processes: state.pavics.workflowWizard.processes,
    currentStep: state.pavics.workflowWizard.currentStep,
    selectedProcess: state.pavics.workflowWizard.selectedProcess
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
