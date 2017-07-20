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
    goToSection: React.PropTypes.func.isRequired,
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
    this.props.workflowAPIActions.fetchWorkflows({ filter:JSON.stringify({ where: {projectId: this.props.project.currentProject.id}})});
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
          <Tab value={WORKFLOW_TAB_VALUE} label="Scientific Workflows">
            {
              (this.state.activeTab === WORKFLOW_TAB_VALUE) ?
                <ScientificWorkflowStepper
                  goToSection={this.props.goToSection}
                  project={this.props.project}
                  showDialog={this.showDialog}
                  selectedRegions={this.props.selectedRegions}
                  selectedDatasetLayer={this.props.selectedDatasetLayer}
                  selectedShapefile={this.props.selectedShapefile}
                  selectedProvider={__PAVICS_WORKFLOW_PROVIDER__}
                  selectedProcess={{identifier: __PAVICS_RUN_WORKFLOW_IDENTIFIER__}}
                  workflow={this.props.workflow}
                  workflowActions={this.props.workflowActions}
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
                  goToSection={this.props.goToSection}
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

