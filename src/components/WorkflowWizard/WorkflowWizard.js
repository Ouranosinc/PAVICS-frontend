import React from 'react';
import ScientificWorkflowStepper from '../../components/ScientificWorkflowStepper';
import WorkflowWizardStepper from '../../components/WorkflowWizard';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';

const WORKFLOW_TAB_VALUE = "WORKFLOW_TAB_VALUE";
const PROCESS_TAB_VALUE = "PROCESS_TAB_VALUE";

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
    // saveWorkflow: React.PropTypes.func.isRequired,
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    fetchProviders: React.PropTypes.func.isRequired,
    // fetchWorkflows: React.PropTypes.func.isRequired,
    // deleteWorkflow: React.PropTypes.func.isRequired,
    fetchProcesses: React.PropTypes.func.isRequired,
    setProcessInputs: React.PropTypes.func.isRequired,
    fetchProcessInputs: React.PropTypes.func.isRequired,
    selectWpsProvider: React.PropTypes.func.isRequired,
    providers: React.PropTypes.object.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    getFirstStep: React.PropTypes.func.isRequired,
    getLastStep: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    project: React.PropTypes.object.isRequired,
    workflow: React.PropTypes.object.isRequired,
    workflowAPI: React.PropTypes.object.isRequired,
    workflowActions: React.PropTypes.object.isRequired,
    workflowAPIActions: React.PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.deleteWorkflowCallback = this.deleteWorkflowCallback.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.props.fetchProviders();
    if (this.props.selectedProvider) {
      this.props.fetchProcesses(this.props.selectedProvider);
    }
    this.state = {
      dialogOpened: false,
      dialogTitle: '',
      dialogContent: '',
      dialogActions: [],
      activeTab: WORKFLOW_TAB_VALUE
    };
  }

  componentDidMount () {
    this.props.workflowAPIActions.fetchWorkflows({ projectId: this.props.project.currentProject.id});
  }

  deleteWorkflowCallback (id) {
    // this.props.deleteWorkflow(id);
    this.props.workflowAPIActions.deleteWorkflow({id: id});
  }

  openDialog () {
    this.setState({
      dialogOpened: true
    });
  }

  closeDialog () {
    this.setState({
      dialogOpened: false
    });
  }

  showDialog (title, content, actions) {
    const defaultDialogActions = [
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.closeDialog}
      />
    ];
    this.setState({
      dialogOpened: true,
      dialogTitle: title,
      dialogContent: content,
      dialogActions: actions ? actions : defaultDialogActions
    });
  }

  handleTabChange(value) {
    if(value === WORKFLOW_TAB_VALUE){
      this.props.getFirstStep(); // Force Process Tab to go back to step 0 on re-rendering
    }
    this.setState({
      activeTab: value
    })
  }

  render () {
    return (
      <div>
        <Tabs
          onChange={(value) => this.handleTabChange(value)}
          value={this.state.activeTab}>
          <Tab value={WORKFLOW_TAB_VALUE} label="Scientific Workflows">
            {
              (this.state.activeTab === WORKFLOW_TAB_VALUE) ?
                <ScientificWorkflowStepper
                  setProcessInputs={this.props.setProcessInputs}
                  showDialog={this.showDialog}
                  providers={this.props.providers}
                  selectedRegions={this.props.selectedRegions}
                  selectedDatasetLayer={this.props.selectedDatasetLayer}
                  selectedShapefile={this.props.selectedShapefile}
                  goToSection={this.props.goToSection}
                  executeProcess={this.props.executeProcess}
                  handleSelectedProcessValueChange={this.props.handleSelectedProcessValueChange}
                  selectedProcess={{identifier: __PAVICS_RUN_WORKFLOW_IDENTIFIER__}}
                  selectedProcessInputs={this.props.selectedProcessInputs}
                  selectedProcessValues={this.props.selectedProcessValues}
                  selectedProvider={__PAVICS_WORKFLOW_PROVIDER__}
                  workflowAPI={this.props.workflowAPI}
                  workflowAPIActions={this.props.workflowAPIActions} /> : null
            }
          </Tab>
          <Tab value={PROCESS_TAB_VALUE} label="WPS Processes">
            {
              (this.state.activeTab === PROCESS_TAB_VALUE) ?
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
                  handleSelectedProcessValueChange={this.props.handleSelectedProcessValueChange}/> : null
            }
          </Tab>
        </Tabs>
        <Dialog
          open={this.state.dialogOpened}
          title={this.state.dialogTitle}
          onRequestClose={this.closeDialog}
          actions={this.state.dialogActions}
          modal={true}>
          {this.state.dialogContent}
        </Dialog>
      </div>

    );
  }
}

