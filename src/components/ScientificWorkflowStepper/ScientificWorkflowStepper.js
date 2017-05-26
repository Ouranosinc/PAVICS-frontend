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
    this.goToConfigureAndRunStep = this.goToConfigureAndRunStep.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.state = {
      activeStep: 0,
      isParsing: false
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

  parseScientificWorkflow = async (workflow) => {
    if (workflow.json && workflow.json.tasks) {
      let tasks = workflow.json.tasks;
      let validProviders = [];
      this.props.providers.items.map(elem => {
        validProviders.push(elem.identifier);
      });
      // validate that each task has a valid provider
      for (let i = 0, nb = tasks.length; i !== nb; i++) {
        let thisTask = tasks[i];
        let thisProvider = thisTask.provider;
        let thisProcess = thisTask.identifier;
        // careful, i is already used
        let j = validProviders.indexOf(thisProvider);
        if (j === -1) {
          throw new Error(`The provider ${thisProvider} is not a valid provider. Please edit the workflow accordingly.`);
        }
        let providerDescription = await this.request(`/phoenix/processesList?provider=${thisProvider}`);
        // we want only the part before the ?
        // also we use tasks[i] because we want the original array to be modified
        // not the local thisTask
        tasks[i]['url'] = providerDescription.url.substring(0, providerDescription.url.indexOf('?'));
        let validIdentifiers = [];
        providerDescription.items.map(elem => validIdentifiers.push(elem.identifier));
        // validate that this task has a valid identifier (that is, the provider provides that identifier)
        if (validIdentifiers.indexOf(thisProcess) === -1) {
          throw new Error(
            'The identifier %s is not a valid process identifier of the provider %s. Please provide valid process identifiers',
            thisProcess,
            thisProvider
          );
        }
        let processDescription = await this.request(`/phoenix/inputs?provider=${thisProvider}&process=${thisProcess}`);
        console.log('this task inputs:', processDescription);
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

  // TODO this will be going in the global store
  // we're manually setting the parsing to true so that the loader is seen, then manually setting it off
  // there is definitely a more elegant way to do this
  goToConfigureAndRunStep (workflow) {
    this.setState({isParsing: true});
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
          <StepLabel style={styleStepLabel}>Sélectionnez l'action 'Configure & Run' du workflow voulu</StepLabel>
          <StepContent>
            <ScientificWorkflowList
              goToConfigureAndRunStep={this.goToConfigureAndRunStep}
              deleteWorkflow={this.props.deleteWorkflowCallback}
              workflows={this.props.workflows}/>
            <p style={styles.orParagraph}>Ou ajoutez un nouveau workflow</p>
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
                    executeProcess={this.props.executeProcess}
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
