import React from 'react';
import {Stepper, Step, StepLabel, StepContent} from 'material-ui/Stepper';
import WpsProviderSelector from './../../components/WpsProviderSelector';
import WpsProcessSelector from './../../components/WpsProcessSelector';
export default class WorkflowWizardStepper extends React.Component {
  static propTypes = {
    stepIndex: React.PropTypes.number.isRequired,
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    fetchProcessInputs: React.PropTypes.func.isRequired,
    selectWpsProvider: React.PropTypes.func.isRequired,
    providers: React.PropTypes.object.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    getLastStep: React.PropTypes.func.isRequired
  }

  render () {
    return (
      <Stepper activeStep={this.props.stepIndex} orientation="vertical">
        <Step>
          <StepLabel>Select WPS Provider</StepLabel>
          <StepContent>
            <WpsProviderSelector
              selectWpsProvider={this.props.selectWpsProvider}
              providers={this.props.providers} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Select WPS Process</StepLabel>
          <StepContent>
            <WpsProcessSelector
              processes={this.props.processes}
              chooseProcess={this.props.chooseProcess}
              fetchProcessInputs={this.props.fetchProcessInputs}
              selectedProvider={this.props.selectedProvider}
              getLastStep={this.props.getLastStep} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Input Parameters</StepLabel>
        </Step>
      </Stepper>
    );
  }
}
