import React from 'react';
import {connect} from 'react-redux';
import {WorkflowWizard} from './../../../containers';
import {
  chooseProcess
} from './../modules/Pavics';
class Pavics extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    currentStep: React.PropTypes.string.isRequired,
    selectedProcess: React.PropTypes.object.isRequired
  };
  render () {
    return (
      <WorkflowWizard
        processes={this.props.processes}
        chooseProcess={this.props.chooseProcess}
        currentStep={this.props.currentStep}
        selectedProcess={this.props.selectedProcess}
      />
    );
  }
}
const mapActionCreators = {
  chooseProcess
};
const mapStateToProps = (state) => {
  return {
    processes: state.pavics.workflowWizard.processes,
    currentStep: state.pavics.workflowWizard.currentStep,
    selectedProcess: state.pavics.workflowWizard.selectedProcess
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
