import React from 'react';
import WorkflowWizardStepper from './../../components/WorkflowWizard';
import { Tabs, Tab } from 'material-ui/Tabs';
import WorkflowsList from '../../components/WorkflowsList/WorkflowsList';
import AddWorkflowForm from '../../components/AddWorkflowForm/AddWorkflowForm';
export default class WorkflowWizard extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    stepIndex: React.PropTypes.number.isRequired,
    selectedProcess: React.PropTypes.object.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    selectedProcessValues: React.PropTypes.object.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    saveWorkflow: React.PropTypes.func.isRequired,
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    fetchProviders: React.PropTypes.func.isRequired,
    fetchWorkflows: React.PropTypes.func.isRequired,
    deleteWorkflow: React.PropTypes.func.isRequired,
    fetchProcesses: React.PropTypes.func.isRequired,
    fetchProcessInputs: React.PropTypes.func.isRequired,
    selectWpsProvider: React.PropTypes.func.isRequired,
    providers: React.PropTypes.object.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    getLastStep: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    workflows: React.PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.deleteWorkflowCallback = this.deleteWorkflowCallback.bind(this);
    this.props.fetchProviders();
    if (this.props.selectedProvider) {
      this.props.fetchProcesses(this.props.selectedProvider);
    }
  }

  componentDidMount () {
    this.props.fetchWorkflows();
  }

  deleteWorkflowCallback (id) {
    this.props.deleteWorkflow(id);
  }

  render () {
    return (
      <Tabs>
        <Tab label="Workflows">
          <WorkflowsList
            deleteWorkflow={this.deleteWorkflowCallback}
            workflows={this.props.workflows} />
          <AddWorkflowForm
            saveWorkflow={this.props.saveWorkflow} />
        </Tab>
        <Tab label="WPS Processes">
          <WorkflowWizardStepper
            selectedRegions={this.props.selectedRegions}
            selectedDatasetLayer={this.props.selectedDatasetLayer}
            selectedShapefile={this.props.selectedShapefile}
            stepIndex={this.props.stepIndex}
            processes={this.props.processes}
            chooseProcess={this.props.chooseProcess}
            fetchProcessInputs={this.props.fetchProcessInputs}
            selectWpsProvider={this.props.selectWpsProvider}
            providers={this.props.providers}
            selectedProvider={this.props.selectedProvider}
            getLastStep={this.props.getLastStep}
            selectedProcess={this.props.selectedProcess}
            selectedProcessValues={this.props.selectedProcessValues}
            selectedProcessInputs={this.props.selectedProcessInputs}
            goToSection={this.props.goToSection}
            executeProcess={this.props.executeProcess}
            handleSelectedProcessValueChange={this.props.handleSelectedProcessValueChange} />
        </Tab>
      </Tabs>
    );
  }
}

