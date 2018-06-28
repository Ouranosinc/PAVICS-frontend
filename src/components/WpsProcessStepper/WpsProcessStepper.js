import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { NotificationManager } from 'react-notifications';
import Step from'@material-ui/core/Step';
import Stepper from'@material-ui/core/Stepper';
import StepConnector from'@material-ui/core/StepConnector';
import StepContent from'@material-ui/core/StepContent';
import StepLabel from'@material-ui/core/StepLabel';
import Typography from'@material-ui/core/Typography';
import WpsProviderSelector from '..//WpsProviderSelector';
import WpsProcessSelector from '..//WpsProcessSelector';
import WpsProcessDetails from '../WpsProcessDetails';
import WpsProcessForm from '../WpsProcessForm';
import Button from'@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';
import myHttp from '../../util/http';

const FORM_PROCESS_ID = 'form-individual-process';
const styles = theme => ({
  white: {
    color: theme.palette.primary.contrastText
  },
});

class WpsProcessStepper extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    goToSection: PropTypes.func.isRequired,
    jobAPIActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    selectedShapefile: PropTypes.object.isRequired,
    currentDisplayedDataset: PropTypes.object.isRequired,
    selectedRegions: PropTypes.array.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      searchKeyword: ''
    };
    this.onProcessSelectionBackButtonClicked = this.onProcessSelectionBackButtonClicked.bind(this);
    this.onSearchKeywordChanged = this.onSearchKeywordChanged.bind(this);
    this.execute = this.execute.bind(this);
  }

  onProcessSelectionBackButtonClicked() {
    this.props.workflowActions.getLastStep();
    this.setState({
      searchKeyword: ''
    })
  }

  onSearchKeywordChanged(value) {
    this.setState({
      searchKeyword: value
    })
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
            NotificationManager.success('Process has been launched with success, you can now monitor process execution in the monitoring panel', 'Success', 4000);
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
    const { classes } = this.props;
    return (
      <Stepper
        activeStep={this.props.workflow.stepIndex}
        orientation="vertical">
        <Step>
          <StepLabel>
            <Typography className={classes.white} variant="headline">
            Select WPS Provider
            </Typography>
            <Typography className={classes.white} variant="subheading">
              {(this.props.workflow.selectedProvider.length && this.props.workflow.stepIndex >= 1)? this.props.workflow.selectedProvider: ''}
            </Typography>
          </StepLabel>
          <StepContent>
            <WpsProviderSelector
              workflow={this.props.workflow}
              workflowActions={this.props.workflowActions} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>
            <Typography className={classes.white} variant="headline">
              Select WPS Process
            </Typography>
            {
              <Typography className={classes.white} variant="subheading">
                {(this.props.workflow.selectedProcess && this.props.workflow.stepIndex >= 2)? this.props.workflow.selectedProcess.title: ''}
              </Typography>
            }
            {
              /*(this.props.workflow.selectedProcess && this.props.workflow.stepIndex >= 2)?
              <WpsProcessDetails
                workflow={this.props.workflow} />:
              null*/
            }
          </StepLabel>
          <StepContent>
            <Button variant="contained"
                    color="secondary"
                    id="cy-step-back-btn"
                    onClick={this.onProcessSelectionBackButtonClicked}>
              <BackIcon />Back
            </Button>
            <WpsProcessSelector
              onSearchKeywordChanged={this.onSearchKeywordChanged}
              searchKeyword={this.state.searchKeyword}
              workflow={this.props.workflow}
              workflowActions={this.props.workflowActions} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>
            <Typography className={classes.white} variant="headline">
              Define Input Parameters
            </Typography>
          </StepLabel>
          <StepContent>
            <div>
              <Button variant="contained"
                      color="secondary"
                      id="cy-step-back-btn"
                      onClick={this.props.workflowActions.getLastStep}>
                <BackIcon />Back
              </Button>
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

export default withStyles(styles)(WpsProcessStepper);
