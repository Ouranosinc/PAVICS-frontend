import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ScientificWorkflowStepper from '../../components/ScientificWorkflowStepper';
import WpsProcessStepper from '../WpsProcessStepper';
import Dialog from'@material-ui/core/Dialog';
import Button from'@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tab from'@material-ui/core/Tab';
import Tabs from'@material-ui/core/Tabs';

const WORKFLOW_TAB_VALUE = "WORKFLOW_TAB_VALUE";
const PROCESS_TAB_VALUE = "PROCESS_TAB_VALUE";
const styles = {
  tab: {
    minWidth: '50%'
  }
};

class WorkflowWizard extends React.Component {

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
    this.props.workflowActions.fetchProviders();
    this.state = {
      dialogOpened: false,
      dialogTitle: '',
      dialogContent: '',
      dialogActions: [],
      activeTab: WORKFLOW_TAB_VALUE
    };
    if (this.props.workflow.selectedProvider) {
      this.props.workflowActions.fetchProcesses(this.props.selectedProvider);
    }
  }

  componentDidMount () {
    if(this.props.project.currentProject.id) {
      this.props.workflowAPIActions.fetchWorkflows({projectId: this.props.project.currentProject.id});
    }
  }

  deleteWorkflowCallback = (id) => {
    if(this.props.project.currentProject.id) {
      this.props.workflowAPIActions.deleteWorkflow({projectId: this.props.project.currentProject.id, id: id});
    }
  };

  openDialog = () => {
    this.setState({
      dialogOpened: true
    });
  };

  closeDialog = () => {
    this.setState({
      dialogOpened: false
    });
  };

  showDialog = (title, content, actions) => {
    const defaultDialogActions = [
      <Button variant="contained"
        label="OK"
        primary={true}
        onClick={this.closeDialog}
      />
    ];
    this.setState({
      dialogOpened: true,
      dialogTitle: title,
      dialogContent: content,
      dialogActions: actions ? actions : defaultDialogActions
    });
  };

  handleTabChange = (value) => {
    if(value === WORKFLOW_TAB_VALUE){
      this.props.workflowActions.getFirstStep(); // Force Process Tab to go back to step 0 on re-rendering
    }
    this.setState({
      activeTab: value
    })
  };

  render () {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            fullWidth
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, value) => this.handleTabChange(value)}
            value={this.state.activeTab}>
            <Tab className={classes.tab} id="cy-scientific-workflow-tab" value={WORKFLOW_TAB_VALUE} label="Scientific Workflows" />
            <Tab className={classes.tab} id="cy-wps-processes-tab" value={PROCESS_TAB_VALUE} label="WPS Processes" />
          </Tabs>
        </AppBar>
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
        {
          (this.state.activeTab === PROCESS_TAB_VALUE) ?
            <WpsProcessStepper
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
        <Dialog
          open={this.state.dialogOpened}
          title={this.state.dialogTitle}
          onClose={this.closeDialog}
          actions={this.state.dialogActions}
          modal={true}>
          {this.state.dialogContent}
        </Dialog>
      </div>

    );
  }
}

export default withStyles(styles)(WorkflowWizard)

