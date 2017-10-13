import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import ScientificWorkflowList from '../../components/ScientificWorkflowList';
import ScientificWorkflowForm from '../../components/ScientificWorkflowForm';
import RaisedButton from 'material-ui/RaisedButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import WpsProcessForm from '../WpsProcessForm';
import myHttp from './../../../lib/http';
const styles = {
  orParagraph: {
    margin: '10px 0',
    textAlign: 'center',
    color: 'white'
  }
};
const FORM_WORKFLOW_ID = "form-workflow-process";
export default class ScientificWorkflowStepper extends Component {
  static propTypes = {
    showDialog: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    jobAPIActions: React.PropTypes.object.isRequired,
    project: React.PropTypes.object.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    currentDisplayedDataset: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    selectedProcess: React.PropTypes.object.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    workflow: React.PropTypes.object.isRequired,
    workflowActions: React.PropTypes.object.isRequired,
    workflowAPI: React.PropTypes.object.isRequired,
    workflowAPIActions: React.PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.catchAndWrapExecuteProcess = this.catchAndWrapExecuteProcess.bind(this);
    this.goToConfigureAndRunStep = this.goToConfigureAndRunStep.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.state = {
      activeStep: 0,
      isParsing: false,
      selectedWorkflow: {}
    };
  }

  request(url) {
    return new Promise((resolve) => {
      myHttp.get(url, {'accept': 'application/json'})
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => console.log(err));
    });

  }

  /*
  "I'm sorry, they made me do this against my will"
    - says a disrupted soul
   */
  parseScientificWorkflow = async (workflow) => {
    if (workflow.json && workflow.json.tasks) {
      let inputsThatShouldBeProvided = [];
      let tasks = workflow.json.tasks;
      workflow.json.parallel_groups.forEach((group) => {
        tasks = tasks.concat(group.tasks);
      });
      let validProviders = [];
      this.props.workflow.providers.items.map(elem => validProviders.push(elem.identifier));
      // validate that each task has a valid provider
      for (let i = 0, nbTasks = tasks.length; i !== nbTasks; i++) {
        let thisTask = tasks[i];
        let thisTaskProvider = thisTask.provider;
        let thisTaskProcessIdentifier = thisTask.identifier;
        if (validProviders.indexOf(thisTaskProvider) === -1) {
          NotificationManager.error(`The provider ${thisTaskProvider} is not a valid provider. Please edit the workflow accordingly.`);
        }
        let providerDescription = await this.request(`/phoenix/processesList?provider=${thisTaskProvider}`);
        // we want only the part before the ?
        // also we use tasks[i] because we want the original array to be modified
        // not the local thisTask
        tasks[i]['url'] = providerDescription.url.substring(0, providerDescription.url.indexOf('?'));
        delete tasks[i]['provider'];
        let validProcessIdentifiers = [];
        providerDescription.items.map(elem => validProcessIdentifiers.push(elem.identifier));
        // validate that this task has a valid identifier (that is, the provider provides that identifier)
        if (validProcessIdentifiers.indexOf(thisTaskProcessIdentifier) === -1) {
          NotificationManager.error(`The identifier ${thisTaskProcessIdentifier} is not a valid process identifier of the provider ${thisTaskProvider}. Please provide valid process identifiers`);
        }
        // if the task has inputs (a task can have only linked_inputs, that are provided by other tasks. those tasks need nothing from the user)
        // here, we validate that all inputs actually exist in the process
        if (thisTask.inputs) {
          let processDescription = await this.request(`/phoenix/inputs?provider=${thisTaskProvider}&process=${thisTaskProcessIdentifier}`);
          let validInputNames = [];
          processDescription.inputs.map(elem => validInputNames.push(elem.name));
          for(let inputName in thisTask.inputs) {
            if(thisTask.inputs.hasOwnProperty(inputName)) {
              let validInputIndex = validInputNames.indexOf(inputName);
              if (validInputIndex === -1) {
                NotificationManager.error(`The input ${inputName} is not a valid input for the process ${thisTaskProcessIdentifier}, it should be one of ${validInputNames.join(', ')}.`);
              }
              console.log('process description:', processDescription);
              inputsThatShouldBeProvided.push({
                name: `${thisTaskProcessIdentifier}.${inputName}`,
                dataType: processDescription.inputs[validInputIndex].dataType,
                description: processDescription.inputs[validInputIndex].description,
                title: processDescription.inputs[validInputIndex].title,
                defaultValue: thisTask.inputs[inputName]
              });
            }
          }
        }
      }
      console.log('inputs that should be provided:', inputsThatShouldBeProvided);
      this.props.workflowActions.setProcessInputs(inputsThatShouldBeProvided);

    } else {
      NotificationManager.error('The workflow is invalid, it lacks a json member.');
    }
  };

  handleNext () {
    this.setState({
      activeStep: this.state.activeStep + 1
    });
  }

  handlePrev () {
    this.setState({
      activeStep: this.state.activeStep - 1
    });
  }

  /*
  totally duplicated in WorkflowWizardStepper, but this one receives the data
  TODO both should be the same, the execute function should receive a form data, or something like that
   */
  execute (formData) {
    // ugly hack to workaround making one extra trip to the backend
    // we already have had to put strange __start__ and __end__ inputs to work nicely with phoenix
    let url = `${__PAVICS_PHOENIX_PATH__}/processes/execute?wps=${this.props.selectedProvider}&process=${this.props.selectedProcess.identifier}`;
    this.makePostRequest(url, formData, (xhr, params) => {
      // status is always 200
      // if(xhr.responseURL.indexOf('/processes/loading') !== -1){ // Deprecated but workek well with phoenix execute() Accept text/html
      try {
        let response = JSON.parse(xhr.responseText);
        if (response.status === 200) {
          this.props.jobAPIActions.createJob({ projectId: this.props.project.currentProject.id, phoenixTaskId: response.task_id });
          NotificationManager.success('Workflow has been launched with success, you can now monitor workflow execution in the monitoring panel', 'Success', 10000);
        }else{
          NotificationManager.error('Workflow hasn\'t been launched as intended. Make sure the workflow and required inputs are defined properly', 'Error', 10000);
        }
      }catch(error){
        NotificationManager.error('Workflow hasn\'t been launched as intended. Make sure the workflow and required inputs are defined properly', 'Error', 10000);
      }
    });
  }

  makePostRequest (url, data, callable, params) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (callable !== undefined) {
        callable(xhr, params);
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader('accept', 'application/json');  // Old: 'text/html'
    xhr.send(data);
  }

  /*
   this horrible nested loop loops over each field of the form and populates the values in the workflow template
   I manually name the inputs that expect user input processIdentifier.inputName when building the form
   so that when filling the workflow, I can validate processIdentifier and inputName and have some kind of insurance that I am filling the right value
   */
  catchAndWrapExecuteProcess() {
    let data = new FormData(document.querySelector(`#${FORM_WORKFLOW_ID}`));
    let toSendData = new FormData();
    let toFillWorkflow = this.state.workflow.json;

    // If mosaic unchecked, no key will be in FormData, TODO same exception for every boolean/checkbox values I guess
    if(!data.get("subset_WFS.mosaic")){
      data.append("subset_WFS.mosaic", "False");
    }
    for (let pair of data) {
      // if there is no dot, the input is deform related, leave it as is
      // but put it in the to be sent data
      if (pair[0].indexOf('.') === -1) {
        toSendData.append(pair[0], pair[1]);
        continue;
      }
      console.log('this pair', pair);
      let keys = pair[0].split('.');
      let tasks = toFillWorkflow.tasks;
      toFillWorkflow.parallel_groups.forEach((group) => {
        tasks = tasks.concat(group.tasks);
      });
      for (let i = 0, nb = tasks.length; i !== nb; i++) {
        // if the process identifier is not the same, we know it's not the right input
        if (tasks[i].inputs && tasks[i].identifier === keys[0]) {
          for (let inputName in tasks[i].inputs) {
            if(tasks[i].inputs.hasOwnProperty(inputName)) {
              if (inputName === keys[1]) {
                if (inputName === 'mosaic') {
                  // mosaic value must always be a "True" of "False" string
                  if(typeof(tasks[i].inputs[inputName] ) === "boolean"){
                    tasks[i].inputs[inputName] = (pair[1] === true)? 'True':'False';
                  }else if(typeof(tasks[i].inputs[inputName]) === "string"){
                    tasks[i].inputs[inputName] = (pair[1] === "True")? 'True':'False';
                  }
                }else{
                  tasks[i].inputs[inputName] = pair[1];
                }
              }

            }
          }
        }
      }
    }
    let stringified = JSON.stringify(toFillWorkflow);
    toSendData.append('workflow_string', stringified);
    console.log('workflow json:', stringified);
    this.execute(toSendData);
  }

  // TODO this will be going in the global store
  // we're manually setting the parsing to true so that the loader is seen, then manually setting it off
  // there is definitely a more elegant way to do this
  goToConfigureAndRunStep (workflow) {
    this.setState({isParsing: true, workflow: workflow});
    this.handleNext();
    this.parseScientificWorkflow(workflow)
      .then(() => this.setState({isParsing: false}))
      .catch(e => {
        this.props.showDialog('Problem', e.message);
        this.setState({isParsing: false});
      });
  }

  render () {
    const styleStepLabel = {
      color: 'white'
    };
    return (
      <Stepper activeStep={this.state.activeStep} orientation="vertical">
        <Step>
          <StepLabel style={styleStepLabel}>Choose the 'Configure & Run' action of the desired workflow</StepLabel>
          <StepContent>
            <ScientificWorkflowList
              goToConfigureAndRunStep={this.goToConfigureAndRunStep}
              workflowAPI={this.props.workflowAPI}
              workflowAPIActions={this.props.workflowAPIActions} />
            <p style={styles.orParagraph}>Or add a new workflow</p>
            <ScientificWorkflowForm
              project={this.props.project}
              workflowAPIActions={this.props.workflowAPIActions}/>
          </StepContent>
        </Step>
        <Step>
          <StepLabel style={styleStepLabel}>Configure & Run</StepLabel>
          {
            this.state.isParsing
              ? (
                <StepContent>
                  <Paper style={{textAlign: 'center', padding: '15px'}}>
                    <CircularProgress />
                    <p>Parsing Workflow</p>
                  </Paper>
                </StepContent>
              )
              : (
                <StepContent>
                  <RaisedButton
                    label="Back"
                    onClick={this.handlePrev}
                    icon={<BackIcon />}/>
                  <WpsProcessForm
                    executeProcess={this.catchAndWrapExecuteProcess}
                    formId={FORM_WORKFLOW_ID}
                    selectedRegions={this.props.selectedRegions}
                    currentDisplayedDataset={this.props.currentDisplayedDataset}
                    selectedShapefile={this.props.selectedShapefile}
                    goToSection={this.props.goToSection}
                    workflow={this.props.workflow}
                    workflowActions={this.props.workflowActions}/>
                </StepContent>
              )
          }

        </Step>
      </Stepper>
    );
  }
}
