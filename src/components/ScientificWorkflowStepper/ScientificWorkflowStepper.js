import React, {Component} from 'react';
import ScientificWorkflowList from '../../components/ScientificWorkflowList';
import ScientificWorkflowForm from '../../components/ScientificWorkflowForm';
import RaisedButton from 'material-ui/RaisedButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';
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
    this.goToConfigureAndRunStep = this.goToConfigureAndRunStep.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.state = {
      activeStep: 0
    };
  }
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

  goToConfigureAndRunStep (workflow) {
    this.handleNext();
    console.log(workflow);
  }
  render() {
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
              workflows={this.props.workflows} />
            <p style={styles.orParagraph}>Ou ajoutez un nouveau workflow</p>
            <ScientificWorkflowForm
              saveWorkflow={this.props.saveWorkflow} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel style={styleStepLabel}>Configure & Run</StepLabel>
          <StepContent>
            <RaisedButton
              label="Back"
              onClick={this.handlePrev}
              icon={<BackIcon />} />
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
              selectedProvider={this.props.selectedProvider} />
          </StepContent>
        </Step>
      </Stepper>
    );
  }
}
