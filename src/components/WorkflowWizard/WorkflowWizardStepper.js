import React from 'react';
import {Stepper, Step, StepLabel, StepContent} from 'material-ui/Stepper';
import WpsProviderSelector from './../../components/WpsProviderSelector';
import WpsProcessSelector from './../../components/WpsProcessSelector';
import WpsProcessDetails from './../../components/WpsProcessDetails';
import WpsProcessForm from './../../components/WpsProcessForm';
import RaisedButton from 'material-ui/RaisedButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
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

  constructor(props) {
    super(props);
    this.execute = this.execute.bind(this);
    this.makePostRequest = this.makePostRequest.bind(this);
  }

  execute () {
    // ugly hack to workaround making one extra trip to the backend
    // we already have had to put strange __start__ and __end__ inputs to work nicely with phoenix
    let test = document.querySelector('#process-form');
    console.log(test);
    let formData = new FormData(document.querySelector('#process-form'));
    for (let pair of formData) {
      console.log(pair);
    }

    let url = `${__PAVICS_PHOENIX_PATH__}/processes/execute?wps=${this.props.selectedProvider}&process=${this.props.selectedProcessIdentifier}`;
    // let url = `/phoenix/execute?wps=${this.props.selectedProvider}&process=${this.props.selectedProcess.identifier}`;
    this.makePostRequest(url, formData, (res) => {
      // TODO actually do something once the post have been done
      console.log(res);
    });
    // this.props.executeProcess(provider, identifier, values);
    // this.props.goToSection(constants.PLATFORM_SECTION_MONITOR);
  }

  makePostRequest (url, data, callable, params) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (callable !== undefined) {
        callable(xhr.responseText, params);
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader('accept', 'text/html');
    xhr.send(data);
  }

  render () {
    const styleStepLabel = {
      color: 'white'
    };
    return (
      <Stepper activeStep={this.props.stepIndex} orientation="vertical">
        <Step>
          <StepLabel style={styleStepLabel}>Select WPS Provider</StepLabel>
          <StepContent>
            <WpsProviderSelector
              selectWpsProvider={this.props.selectWpsProvider}
              providers={this.props.providers} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel style={styleStepLabel}>Select WPS Process</StepLabel>
          <StepContent>
            <RaisedButton
              label="Back"
              onClick={this.props.getLastStep}
              icon={<BackIcon />} />
            <WpsProcessSelector
              processes={this.props.processes}
              chooseProcess={this.props.chooseProcess}
              fetchProcessInputs={this.props.fetchProcessInputs}
              selectedProvider={this.props.selectedProvider} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel style={styleStepLabel}>Input Parameters</StepLabel>
          <StepContent>
            <div>
              <RaisedButton
                label="Back"
                onClick={this.props.getLastStep}
                icon={<BackIcon />} />
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
                    executeProcess={this.execute}
                    handleSelectedProcessValueChange={this.props.handleSelectedProcessValueChange}
                    selectedProcess={this.props.selectedProcess}
                    selectedProcessInputs={this.props.selectedProcessInputs}
                    selectedProcessValues={this.props.selectedProcessValues}
                    selectedProvider={this.props.selectedProvider} />
              }
            </div>
          </StepContent>
        </Step>
      </Stepper>
    );
  }
}
