import React from 'react';
import PropTypes from 'prop-types';
import ScientificWorkflowStepper from '../../components/ScientificWorkflowStepper';
import WorkflowWizardStepper from '../../components/WorkflowWizard';
import Dialog from'@material-ui/core/Dialog';
import Button from'@material-ui/core/Button';
import { Tabs, Tab } from'@material-ui/core/Tabs';

const WORKFLOW_TAB_VALUE = "WORKFLOW_TAB_VALUE";
const PROCESS_TAB_VALUE = "PROCESS_TAB_VALUE";

export default class WorkflowWizard extends React.Component {
  static propTypes = {
    goToSection: PropTypes.func.isRequired,
    jobAPIActions: PropTypes.object.isRequired,
    selectedShapefile: PropTypes.object.isRequired,
    currentDisplayedDataset: PropTypes.object.isRequired,
    selectedRegions: PropTypes.array.isRequired,
    project: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowAPI: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired,
    workflowAPIActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.deleteWorkflowCallback = this.deleteWorkflowCallback.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.props.workflowActions.fetchProviders();
    if (this.props.workflow.selectedProvider) {
      this.props.workflowActions.fetchProcesses(this.props.selectedProvider);
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
    if(this.props.project.currentProject.id) {
      this.props.workflowAPIActions.fetchWorkflows({projectId: this.props.project.currentProject.id});
    }
  }

  deleteWorkflowCallback (id) {
    if(this.props.project.currentProject.id) {
      this.props.workflowAPIActions.deleteWorkflow({projectId: this.props.project.currentProject.id, id: id});
    }
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
      <Button variant="contained"
        label="OK"
        primary={true}
        keyboardFocused={true}
        onClick={this.closeDialog}
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
      this.props.workflowActions.getFirstStep(); // Force Process Tab to go back to step 0 on re-rendering
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
          <Tab id="cy-scientific-workflow-tab" value={WORKFLOW_TAB_VALUE} label="Scientific Workflows">
            {
              (this.state.activeTab === WORKFLOW_TAB_VALUE) ?
                <ScientificWorkflowStepper
                  goToSection={this.props.goToSection}
                  jobAPIActions={this.props.jobAPIActions}
                  project={this.props.project}
                  showDialog={this.showDialog}
                  selectedRegions={this.props.selectedRegions}
                  currentDisplayedDataset={this.props.currentDisplayedDataset}
                  selectedShapefile={this.props.selectedShapefile}
                  selectedProvider={__PAVICS_WORKFLOW_PROVIDER__}
                  selectedProcess={{identifier: __PAVICS_RUN_WORKFLOW_IDENTIFIER__}}
                  workflow={this.props.workflow}
                  workflowActions={this.props.workflowActions}
                  workflowAPI={this.props.workflowAPI}
                  workflowAPIActions={this.props.workflowAPIActions} /> : null
            }
          </Tab>
          <Tab id="cy-wps-processes-tab" value={PROCESS_TAB_VALUE} label="WPS Processes">
            {
              (this.state.activeTab === PROCESS_TAB_VALUE) ?
                <WorkflowWizardStepper
                  goToSection={this.props.goToSection}
                  jobAPIActions={this.props.jobAPIActions}
                  project={this.props.project}
                  selectedRegions={this.props.selectedRegions}
                  currentDisplayedDataset={this.props.currentDisplayedDataset}
                  selectedShapefile={this.props.selectedShapefile}
                  workflow={this.props.workflow}
                  workflowActions={this.props.workflowActions}
                /> : null
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

