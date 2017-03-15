import React from 'react';
import WorkflowWizardStepper from './../../components/WorkflowWizard';
export default class WorkflowWizard extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    stepIndex: React.PropTypes.number.isRequired,
    selectedProcess: React.PropTypes.object.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    selectedProcessValues: React.PropTypes.object.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    fetchProviders: React.PropTypes.func.isRequired,
    fetchProcesses: React.PropTypes.func.isRequired,
    fetchProcessInputs: React.PropTypes.func.isRequired,
    selectWpsProvider: React.PropTypes.func.isRequired,
    providers: React.PropTypes.object.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    getLastStep: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.props.fetchProviders();
    if (this.props.selectedProvider) {
      this.props.fetchProcesses(this.props.selectedProvider);
    }
  }

  render () {
    return <WorkflowWizardStepper
      selectedDatasetLayer={this.props.selectedDatasetLayer}
      selectedShapefile={this.props.selectedShapefile}
      stepIndex={this.props.stepIndex}
      processes={this.props.processes}
      chooseProcess={this.props.chooseProcess}
      fetchProcessInputs={this.props.fetchProcessInputs}
      selectWpsProvider={this.props.selectWpsProvider}
      providers={this.props.providers}
      selectedProvider={this.props.selectedProvider}
      getLastStep={this.props.getLastStep}
      selectedProcess={this.props.selectedProcess}
      selectedProcessValues={this.props.selectedProcessValues}
      selectedProcessInputs={this.props.selectedProcessInputs}
      goToSection={this.props.goToSection}
      executeProcess={this.props.executeProcess}
      handleSelectedProcessValueChange={this.props.handleSelectedProcessValueChange} />;
  }
}

