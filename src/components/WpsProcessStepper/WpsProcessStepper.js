import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Step from'@material-ui/core/Step';
import Stepper from'@material-ui/core/Stepper';
import StepContent from'@material-ui/core/StepContent';
import StepLabel from'@material-ui/core/StepLabel';
import Typography from'@material-ui/core/Typography';
import WpsProviderSelector from '..//WpsProviderSelector';
import WpsProcessSelector from '..//WpsProcessSelector';
import WpsProcessFormContainer from './../../containers/WpsProcessForm';
import Button from'@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';

const styles = theme => ({
  white: {
    color: theme.palette.primary.contrastText
  },
});

class WpsProcessStepper extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    jobAPIActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
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

  wrapInputsArray(formData){
    let inputs = [];
    for (let inputName in formData) {
      if (formData.hasOwnProperty(inputName)) {
        let splitted = inputName.split('.');
        // We need to change arrays into independent inputs
        if(Array.isArray(formData[inputName])) {
          formData[inputName].forEach(value => {
            inputs.push({
              id: splitted[1],
              type: splitted[0],
              value: value
            })
          })
        } else {
          inputs.push({
            id: splitted[1],
            type: splitted[0],
            value: formData[inputName]
          })
        }
      }
    }
    return {
      "inputs": inputs
    };
  }

  executeProcess = (formData) => {
    this.props.workflowActions.executeProcess(
      this.props.workflow.selectedProvider,
      this.props.workflow.selectedProcess.id,
      this.wrapInputsArray(formData)
    );
  };

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
            <React.Fragment>
              <Button variant="contained"
                      color="secondary"
                      id="cy-step-back-btn"
                      onClick={this.props.workflowActions.getLastStep}>
                <BackIcon />Back
              </Button>
              {
                this.props.workflow.selectedProcessInputs.length ?
                <WpsProcessFormContainer execute={this.executeProcess} />: null
              }
            </React.Fragment>
          </StepContent>
        </Step>
      </Stepper>
    );
  }
}

export default withStyles(styles)(WpsProcessStepper);
