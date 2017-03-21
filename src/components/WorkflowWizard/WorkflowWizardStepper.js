import React from 'react';
import {Stepper, Step, StepLabel, StepContent} from 'material-ui/Stepper';
import WpsProviderSelector from './../../components/WpsProviderSelector';
import WpsProcessSelector from './../../components/WpsProcessSelector';
import WpsProcessDetails from './../../components/WpsProcessDetails';
import WpsProcessForm from './../../components/WpsProcessForm';
import RaisedButton from 'material-ui/RaisedButton';
export default class WorkflowWizardStepper extends React.Component {
  static propTypes = {
    stepIndex: React.PropTypes.number.isRequired,
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    fetchProcessInputs: React.PropTypes.func.isRequired,
    selectWpsProvider: React.PropTypes.func.isRequired,
    providers: React.PropTypes.object.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    getLastStep: React.PropTypes.func.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    selectedProcessValues: React.PropTypes.object.isRequired,
    selectedProcess: React.PropTypes.object.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired
  };

  render () {
    const overflowable = {
      'height': '400px',
      'overflowY': 'auto',
      'overflowX': 'hidden',
      'margin': '10px 0'
    };
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
              selectedProvider={this.props.selectedProvider} />
            <RaisedButton label="Back" onClick={this.props.getLastStep} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Input Parameters</StepLabel>
          <StepContent>
            <div style={overflowable}>
              <WpsProcessDetails
                process={this.props.selectedProcess} />
              {
                this.props.selectedProcessInputs.length === 0
                  ? null
                  : <WpsProcessForm
                    selectedRegions={this.props.selectedRegions}
                    selectedDatasetLayer={this.props.selectedDatasetLayer}
                    selectedShapefile={this.props.selectedShapefile}
                    goToSection={this.props.goToSection}
                    executeProcess={this.props.executeProcess}
                    handleSelectedProcessValueChange={this.props.handleSelectedProcessValueChange}
                    selectedProcess={this.props.selectedProcess}
                    selectedProcessInputs={this.props.selectedProcessInputs}
                    selectedProcessValues={this.props.selectedProcessValues}
                    selectedProvider={this.props.selectedProvider} />
              }
            </div>
            <RaisedButton label="Back" onClick={this.props.getLastStep} />
          </StepContent>
        </Step>
      </Stepper>
    );
  }
}
