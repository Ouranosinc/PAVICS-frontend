import React from 'react';
import { NotificationManager } from 'react-notifications';
import {Stepper, Step, StepLabel, StepContent} from 'material-ui/Stepper';
import WpsProviderSelector from './../../components/WpsProviderSelector';
import WpsProcessSelector from './../../components/WpsProcessSelector';
import WpsProcessDetails from './../../components/WpsProcessDetails';
import WpsProcessForm from './../../components/WpsProcessForm';
import RaisedButton from 'material-ui/RaisedButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import myHttp from './../../../lib/http';

const FORM_PROCESS_ID = 'form-individual-process';

export default class WorkflowWizardStepper extends React.Component {
  static propTypes = {
    goToSection: React.PropTypes.func.isRequired,
    jobAPIActions: React.PropTypes.object.isRequired,
    project: React.PropTypes.object.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    currentDisplayedDataset: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    workflow: React.PropTypes.object.isRequired,
    workflowActions: React.PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.execute = this.execute.bind(this);
  }

  execute () {
    // ugly hack to workaround making one extra trip to the backend
    // we already have had to put strange __start__ and __end__ inputs to work nicely with phoenix
    let formData = new FormData(document.querySelector(`#${FORM_PROCESS_ID}`));
    let url = `/phoenix/processes/execute?wps=${this.props.workflow.selectedProvider}&process=${this.props.workflow.selectedProcess.identifier}`;
    const additionalHeaders = {
      'accept': 'application/json'
    };
    myHttp.postFormData(url, formData, additionalHeaders)
      .then(res => res.json())
      .then(response => {
        // status is always 200
        // if(xhr.responseURL.indexOf('/processes/loading') !== -1){ // Deprecated but workek well with phoenix execute() Accept text/html
        console.log('received response from phoenix: %o', response);
        try {
          if (response.status === 200) {
            this.props.jobAPIActions.createJob({ projectId: this.props.project.currentProject.id, phoenixTaskId: response.task_id });
            NotificationManager.success('Process has been launched with success, you can now monitor process execution in the monitoring panel', 'Success', 10000);
          } else {
            NotificationManager.error('Process hasn\'t been launched as intended. Make sure the process and required inputs are defined properly', 'Error', 10000);
          }
        } catch (error) {
          NotificationManager.error('Process hasn\'t been launched as intended. Make sure the process and required inputs are defined properly', 'Error', 10000);
        }
      })
      .catch(err => console.log(err));
  }

  render () {
    const styleStepLabel = {
      color: 'white'
    };
    const innerStyleStepLabel = {
      fontWeight: 'bold',
      marginTop: '60px',
      marginLeft: '-100px'
    };
    return (
      <Stepper activeStep={this.props.workflow.stepIndex} orientation="vertical">
        <Step>
          <StepLabel style={styleStepLabel}>
            Select WPS Provider
            <span style={innerStyleStepLabel}>{(this.props.workflow.selectedProvider.length && this.props.workflow.stepIndex >= 1)? this.props.workflow.selectedProvider: ''}</span>
          </StepLabel>
          <StepContent>
            <WpsProviderSelector
              workflow={this.props.workflow}
              workflowActions={this.props.workflowActions} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel style={styleStepLabel}>
            Select WPS Process
            <span style={innerStyleStepLabel}>{(this.props.workflow.selectedProcess && this.props.workflow.stepIndex >= 2)? this.props.workflow.selectedProcess.title: ''}</span>
          </StepLabel>
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
                    currentDisplayedDataset={this.props.currentDisplayedDataset}
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
