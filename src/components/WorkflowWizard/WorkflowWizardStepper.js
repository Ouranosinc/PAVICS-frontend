import React from 'react';
import {Stepper, Step, StepLabel, StepContent} from 'material-ui/Stepper';
import WpsProviderSelector from './../../components/WpsProviderSelector';
import WpsProcessSelector from './../../components/WpsProcessSelector';
import WpsProcessDetails from './../../components/WpsProcessDetails';
import WpsProcessForm from './../../components/WpsProcessForm';
import RaisedButton from 'material-ui/RaisedButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';

const FORM_PROCESS_ID = "form-individual-process";

export default class WorkflowWizardStepper extends React.Component {
  static propTypes = {
    goToSection: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    workflow: React.PropTypes.object.isRequired,
    workflowActions: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.execute = this.execute.bind(this);
    this.makePostRequest = this.makePostRequest.bind(this);
  }

  execute () {
    // ugly hack to workaround making one extra trip to the backend
    // we already have had to put strange __start__ and __end__ inputs to work nicely with phoenix
    let formData = new FormData(document.querySelector(`#${FORM_PROCESS_ID}`));
    for (let pair of formData) {
      console.log(pair);
    }

    let url = `${__PAVICS_PHOENIX_PATH__}/processes/execute?wps=${this.props.workflow.selectedProvider}&process=${this.props.workflow.selectedProcess.identifier}`;
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
      <Stepper activeStep={this.props.workflow.stepIndex} orientation="vertical">
        <Step>
          <StepLabel style={styleStepLabel}>Select WPS Provider</StepLabel>
          <StepContent>
            <WpsProviderSelector
              workflow={this.props.workflow}
              workflowActions={this.props.workflowActions} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel style={styleStepLabel}>Select WPS Process</StepLabel>
          <StepContent>
            <RaisedButton
              label="Back"
              onClick={this.props.workflowActions.getLastStep}
              icon={<BackIcon />} />
            <WpsProcessSelector
              workflow={this.props.workflow}
              workflowActions={this.props.workflowActions} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel style={styleStepLabel}>Input Parameters</StepLabel>
          <StepContent>
            <div>
              <RaisedButton
                label="Back"
                onClick={this.props.workflowActions.getLastStep}
                icon={<BackIcon />} />
              <WpsProcessDetails
                workflow={this.props.workflow} />
              {
                this.props.workflow.selectedProcessInputs.length === 0
                  ? null
                  : <WpsProcessForm
                    executeProcess={this.execute}
                    formId={FORM_PROCESS_ID}
                    goToSection={this.props.goToSection}
                    selectedRegions={this.props.selectedRegions}
                    selectedDatasetLayer={this.props.selectedDatasetLayer}
                    selectedShapefile={this.props.selectedShapefile}
                    workflow={this.props.workflow}
                    workflowActions={this.props.workflowActions} />
              }
            </div>
          </StepContent>
        </Step>
      </Stepper>
    );
  }
}
