import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { NotificationManager } from 'react-notifications';
import ScientificWorkflowList from '../../components/ScientificWorkflowList';
import ScientificWorkflowForm from '../../components/ScientificWorkflowForm';
import Button from'@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';
import Step from'@material-ui/core/Step';
import Stepper from'@material-ui/core/Stepper';
import StepLabel from'@material-ui/core/StepLabel';
import StepContent from'@material-ui/core/StepContent';
import Typography from'@material-ui/core/Typography';
import CircularProgress from'@material-ui/core/CircularProgress';
import Paper from'@material-ui/core/Paper';
import WpsProcessFormContainer from './../../containers/WpsProcessForm';
import myHttp from '../../util/http';
import {InputDefinition} from "../../data-models/InputDefinition";

const styles = theme => ({
  white: {
    color: theme.palette.primary.contrastText
  },
  p: {
    color: theme.palette.primary.contrastText,
    margin: '10px 0',
    textAlign: 'center',
  }
});
const FORM_WORKFLOW_ID = 'form-workflow-process';

class ScientificWorkflowStepper extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    jobAPIActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    showDialog: PropTypes.func.isRequired,
    workflowActions: PropTypes.object.isRequired,
    workflowAPI: PropTypes.object.isRequired,
    workflowAPIActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
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
      if(workflow.json.parallel_groups) {
        workflow.json.parallel_groups.forEach((group) => {
          tasks = tasks.concat(group.tasks);
        });
      }
      let validProviders = [];
      this.props.workflow.providers.items.map(elem => validProviders.push(elem.id));
      // validate that each task has a valid provider
      for (let i = 0, nbTasks = tasks.length; i !== nbTasks; i++) {
        let thisTask = tasks[i];
        let thisTaskProvider = thisTask.provider;
        let thisTaskProcessIdentifier = thisTask.identifier;
        if (validProviders.indexOf(thisTaskProvider) === -1) {
          NotificationManager.warning(`The provider ${thisTaskProvider} is not a valid provider. Please edit the workflow accordingly.`, 'Warning', 10000);
        }
        // FIXME: Reuse workflow.fetchProcesses() ?
        let processes = await this.request(`${__PAVICS_TWITCHER_API_PATH__}/providers/${thisTaskProvider}/processes`);
        // we want only the part before the ?
        // also we use tasks[i] because we want the original array to be modified
        // not the local thisTask
        // tasks[i]['url'] = providerDescription.url.substring(0, providerDescription.url.indexOf('?'));
        // delete tasks[i]['provider']; // why ?
        // let validProcessIdentifiers = [];
        // FIXME: bad use of map()
        // // providerDescription.items.map(elem => validProcessIdentifiers.push(elem.id));
        // validate that this task has a valid identifier (that is, the provider provides that identifier)
        if (!processes.find(p => p.id === thisTaskProcessIdentifier)) {
          NotificationManager.error(`The identifier ${thisTaskProcessIdentifier} is not a valid process identifier of the provider ${thisTaskProvider}. Please provide valid process identifiers`, 'Warning', 10000);
        }
        // if the task has inputs (a task can have only linked_inputs, that are provided by other tasks. those tasks need nothing from the user)
        // here, we validate that all inputs actually exist in the process
        if (thisTask.inputs) {
          // FIXME: Reuse workflow.fetchProcessInputs() ?
          let processDescription = await this.request(`${__PAVICS_TWITCHER_API_PATH__}/providers/${thisTaskProvider}/processes/${thisTaskProcessIdentifier}`);
          let validInputIds = processDescription.inputs.map(elem => elem.id);
          for (let inputName in thisTask.inputs) {
            if (thisTask.inputs.hasOwnProperty(inputName)) {
              let validInputIndex = validInputIds.indexOf(inputName);
              if (validInputIndex === -1) {
                NotificationManager.warning(`The input ${inputName} is not a valid input for the process ${thisTaskProcessIdentifier}, it should be one of ${validInputIds.join(', ')}.`, 'Warning', 10000);
              }
              console.log('process description:', processDescription);
              inputsThatShouldBeProvided.push(new InputDefinition(
                `${thisTaskProcessIdentifier}.${inputName}`,
                processDescription.inputs[validInputIndex].dataType,
                processDescription.inputs[validInputIndex].title,
                processDescription.inputs[validInputIndex].description,
                processDescription.inputs[validInputIndex].minOccurs,
                processDescription.inputs[validInputIndex].maxOccurs,
                thisTask.inputs[inputName],
                processDescription.inputs[validInputIndex].allowedValues
              ));
            }
          }
        }
      }
      console.log('inputs that should be provided:', inputsThatShouldBeProvided);
      this.props.workflowActions.setProcessInputs(inputsThatShouldBeProvided);
    } else {
      NotificationManager.warning('The workflow is invalid, it lacks a json member.', 'Warning', 10000);
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

  injectInputsInWorkflow(formData, workflow) {
    let filledWorkflow = JSON.parse(JSON.stringify(workflow));
    for (let uniqueInputName in formData) {
      let keys = uniqueInputName.split('.'); // [0] = type, [1] = task.identifier, [2] = input id
      let tasks = filledWorkflow.tasks;

      function injectWhenMatching(task, taskId, inputId, value) {
        if (task.inputs && task.identifier === taskId) {
          for (let inputName in task.inputs) {
            if (task.inputs.hasOwnProperty(inputName)) {
              if (inputName === inputId) {
                // Exception: mosaic value must always be a "True" of "False" string
                if (inputName === 'mosaic') {
                  // How can it be both types?
                  if (typeof (task.inputs[inputName]) === 'boolean') {
                    task.inputs['mosaic'] = (value === true) ? 'True' : 'False';
                  } else if (typeof (task.inputs[inputName]) === 'string') {
                    task.inputs['mosaic'] = (value === 'True') ? 'True' : 'False';
                  }
                } else {
                  task.inputs[inputName] = value;
                }
              }
            }
          }
        }
      }

      if (filledWorkflow.parallel_groups) {
        filledWorkflow.parallel_groups.forEach((group) => {
          group.tasks.forEach(task => {
            injectWhenMatching(task, keys[1], keys[2], formData[uniqueInputName])
          });
        });
      }

      tasks.forEach(task => {
        injectWhenMatching(task, keys[1], keys[2], formData[uniqueInputName])
      });
    }
    return filledWorkflow;
  }

  wrapWorkflowAsProcessInputsArray(workflow) {
    let stringifiedWorkflow = JSON.stringify(workflow);
    localStorage.setItem('executed_workflow', stringifiedWorkflow);
    return {
      "inputs": [
        {
          type: 'string',
          id: __PAVICS_RUN_WORKFLOW_INPUT_ID__,
          value: stringifiedWorkflow
        }
      ]
    };
  }

  executeWorkflow = (formData) => {
    const filledWorkflow = this.injectInputsInWorkflow(formData, this.state.workflow.json);
    this.props.workflowActions.executeWorkflow(
      this.state.workflow.name,
      this.wrapWorkflowAsProcessInputsArray(filledWorkflow)
    );
  };

  // TODO: this will be going in the redux store. When?
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
    const { classes } = this.props;
    return (
      <Stepper className={classes.stepper} activeStep={this.state.activeStep} orientation="vertical">
        <Step>
          <StepLabel id="cy-configure-run-step">
            <Typography className={classes.white} variant="headline">
              Choose the 'Configure & Run' action of the desired workflow
            </Typography>
            {
              <Typography className={classes.white} variant="subheading">
                {(this.state.workflow)? this.state.workflow.name: ''}
              </Typography>
            }
          </StepLabel>
          <StepContent>
            <ScientificWorkflowList
              project={this.props.project}
              goToConfigureAndRunStep={this.goToConfigureAndRunStep}
              workflowAPI={this.props.workflowAPI}
              workflowAPIActions={this.props.workflowAPIActions} />
            <Typography variant="subheading" className={classes.p}>Or create a new workflow</Typography>
            <ScientificWorkflowForm
              project={this.props.project}
              workflowAPIActions={this.props.workflowAPIActions} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>
            <Typography className={classes.white} variant="headline">
              Configure & Run
            </Typography>
          </StepLabel>
          {
            this.state.isParsing
              ? (
                <StepContent>
                  <Button
                    color="secondary"
                    variant="contained"
                    id="cy-step-back-btn"
                    onClick={this.handlePrev}>
                    <BackIcon />Back
                  </Button>
                  <Paper style={{margin: '10px 0', textAlign: 'center', padding: '15px'}}>
                    <CircularProgress />
                    <p>Parsing Workflow</p>
                  </Paper>
                </StepContent>
              )
              : (
                <StepContent>
                  <Button
                    color="secondary"
                    variant="contained"
                    id="cy-step-back-btn"
                    onClick={this.handlePrev}>
                    <BackIcon />Back
                  </Button>
                  <WpsProcessFormContainer execute={this.executeWorkflow} />
                </StepContent>
              )
          }

        </Step>
      </Stepper>
    );
  }
}

export default withStyles(styles)(ScientificWorkflowStepper)
