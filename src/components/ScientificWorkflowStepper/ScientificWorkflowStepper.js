import React, { Component } from 'react';
import ScientificWorkflowList from '../../components/ScientificWorkflowList';
import ScientificWorkflowForm from '../../components/ScientificWorkflowForm';
import RaisedButton from 'material-ui/RaisedButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import WpsProcessForm from '../WpsProcessForm';
const styles = {
  orParagraph: {
    margin: '10px 0',
    textAlign: 'center',
    color: 'white'
  }
};
export default class ScientificWorkflowStepper extends Component {
  static propTypes = {
    workflows: React.PropTypes.object.isRequired,
    saveWorkflow: React.PropTypes.func.isRequired,
    deleteWorkflowCallback: React.PropTypes.func.isRequired,
    setProcessInputs: React.PropTypes.func.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    selectedProcessValues: React.PropTypes.object.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    showDialog: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    selectedProcess: React.PropTypes.object.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    providers: React.PropTypes.object.isRequired
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

  request (url) {
    let headers = new Headers();
    headers.append('accept', 'application/json');
    let options = {
      method: 'GET',
      headers: headers
    };
    return new Promise((resolve) => {
      fetch(url, options)
        .then(res => res.json())
        .then(json => resolve(json));
    });

  }

  /*
  I'm sorry
  they made me do this against my will
   */
  parseScientificWorkflow = async (workflow) => {
    if (workflow.json && workflow.json.tasks) {
      let tasks = workflow.json.tasks;
      let inputsThatShouldBeProvided = [];
      let validProviders = [];
      this.props.providers.items.map(elem => validProviders.push(elem.identifier));
      // validate that each task has a valid provider
      for (let i = 0, nbTasks = tasks.length; i !== nbTasks; i++) {
        let thisTask = tasks[i];
        let thisTaskProvider = thisTask.provider;
        let thisTaskProcessIdentifier = thisTask.identifier;
        if (validProviders.indexOf(thisTaskProvider) === -1) {
          throw new Error(`The provider ${thisTaskProvider} is not a valid provider. Please edit the workflow accordingly.`);
        }
        let providerDescription = await this.request(`/phoenix/processesList?provider=${thisTaskProvider}`);
        // we want only the part before the ?
        // also we use tasks[i] because we want the original array to be modified
        // not the local thisTask
        tasks[i]['url'] = providerDescription.url.substring(0, providerDescription.url.indexOf('?'));
        let validProcessIdentifiers = [];
        providerDescription.items.map(elem => validProcessIdentifiers.push(elem.identifier));
        // validate that this task has a valid identifier (that is, the provider provides that identifier)
        if (validProcessIdentifiers.indexOf(thisTaskProcessIdentifier) === -1) {
          throw new Error(`The identifier ${thisTaskProcessIdentifier} is not a valid process identifier of the provider ${thisTaskProvider}. Please provide valid process identifiers`);
        }
        // if the task has inputs (a task can have only linked_inputs, that are provided by other tasks. those tasks need nothing from the user)
        // here, we validate that all inputs actually exist in the process
        if (thisTask.inputs) {
          let processDescription = await this.request(`/phoenix/inputs?provider=${thisTaskProvider}&process=${thisTaskProcessIdentifier}`);
          let validInputNames = [];
          processDescription.inputs.map(elem => validInputNames.push(elem.name));
          for (let j = 0, nbInputs = thisTask.inputs.length; j !== nbInputs; j++) {
             let thisInputName = thisTask.inputs[j][0];
             let validInputIndex = validInputNames.indexOf(thisInputName);
             if (validInputIndex === -1) {
               throw new Error(`The input ${thisInputName} is not a valid input for the process ${thisTaskProcessIdentifier}, it should be one of ${validInputNames.join(', ')}.`);
             }
             console.log('process description:', processDescription);
             inputsThatShouldBeProvided.push({
               name: `${thisTaskProcessIdentifier}.${thisInputName}`,
               dataType: processDescription.inputs[validInputIndex].dataType,
               description: processDescription.inputs[validInputIndex].description
             });
          }
        }
        console.log('inputs that should be provided:', inputsThatShouldBeProvided);
        this.props.setProcessInputs(inputsThatShouldBeProvided);
      }
    } else {
      throw new Error('The workflow is invalid, it lacks a json member.');
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

  /*
   this horrible nested loop loops over each field of the form and populates the values in the workflow template
   I manually name the inputs that expect user input processIdentifier.inputName when building the form
   so that when filling the workflow, I can validate processIdentifier and inputName and have some kind of insurance that I am filling the right value
   */
  catchAndWrapExecuteProcess() {
    let data = new FormData(document.querySelector('#process-form'));
    let toSendData = new FormData();
    let toFillWorkflow = this.state.workflow.json;
    for (let pair of data) {
      // if there is no dot, the input is deform related, leave it as is
      // but put it in the to be sent data
      if (pair[0].indexOf('.') === -1) {
        toSendData.append(pair[0], pair[1]);
        continue;
      }
      console.log('this pair', pair);
      let keys = pair[0].split('.');
      for (let i = 0, nb = toFillWorkflow.tasks.length; i !== nb; i++) {
        // if the process identifier is not the same, we know it's not the right input
        if (toFillWorkflow.tasks[i].inputs && toFillWorkflow.tasks[i].identifier === keys[0]) {
          for (let j = 0, nbInputs = toFillWorkflow.tasks[i].inputs.length; j !== nbInputs; j++) {
            // validate the input name, then associate the user input to the workflow
            // the workflow inputs are arrays with two entries, the first being the key, the second the value
            // so while this seem like
            if (toFillWorkflow.tasks[i].inputs[j][0] === keys[1]) {
              console.log('this input:', toFillWorkflow.tasks[i].inputs[j]);
              toFillWorkflow.tasks[i].inputs[j][1] = pair[1];
            }
            // hardcoding false value for mosaic input
            // TODO this should be somewhat dynamic, once the inputs sent from workflow are not key value pairs anymore
            if (toFillWorkflow.tasks[i].inputs[j][0] === 'mosaic') {
              toFillWorkflow.tasks[i].inputs[j][1] = 'False';
            }
          }
        }
      }
    }
    toSendData.append('workflow_string', JSON.stringify(toFillWorkflow));
    console.log('workflow json:', JSON.stringify(toFillWorkflow));
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
              deleteWorkflow={this.props.deleteWorkflowCallback}
              workflows={this.props.workflows}/>
            <p style={styles.orParagraph}>Or add a new workflow</p>
            <ScientificWorkflowForm
              saveWorkflow={this.props.saveWorkflow}/>
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
                    selectedRegions={this.props.selectedRegions}
                    selectedDatasetLayer={this.props.selectedDatasetLayer}
                    selectedShapefile={this.props.selectedShapefile}
                    goToSection={this.props.goToSection}
                    executeProcess={this.catchAndWrapExecuteProcess}
                    handleSelectedProcessValueChange={this.props.handleSelectedProcessValueChange}
                    selectedProcess={this.props.selectedProcess}
                    selectedProcessInputs={this.props.selectedProcessInputs}
                    selectedProcessValues={this.props.selectedProcessValues}
                    selectedProvider={this.props.selectedProvider}/>
                </StepContent>
              )
          }

        </Step>
      </Stepper>
    );
  }
}
