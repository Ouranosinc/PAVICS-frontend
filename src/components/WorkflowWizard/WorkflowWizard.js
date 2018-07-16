import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ScientificWorkflowStepper from '../../components/ScientificWorkflowStepper';
import WpsProcessStepper from '../WpsProcessStepper';
import Dialog from'@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from'@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tab from'@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

const WORKFLOW_TAB_VALUE = "WORKFLOW_TAB_VALUE";
const PROCESS_TAB_VALUE = "PROCESS_TAB_VALUE";
const styles = {
  tab: {
    minWidth: '50%'
  }
};

class WorkflowWizard extends React.Component {
  state = {
    dialogOpened: false,
    dialogTitle: '',
    dialogContent: '',
    dialogActions: [],
    activeTab: WORKFLOW_TAB_VALUE
  };

  static propTypes = {
    jobAPIActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    sectionActions: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowAPI: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired,
    workflowAPIActions: PropTypes.object.isRequired,
    visualize: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.props.workflowActions.fetchProviders();
    if (this.props.workflow.selectedProvider) {
      this.props.workflowActions.fetchProcesses(this.props.workflow.selectedProvider);
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

  showDialog = (title, content) => {
    this.setState({
      dialogOpened: true,
      dialogTitle: title,
      dialogContent: content
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
      <React.Fragment>
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
              jobAPIActions={this.props.jobAPIActions}
              project={this.props.project}
              sectionActions={this.props.sectionActions}
              selectedProvider={__PAVICS_WORKFLOW_PROVIDER__}
              selectedProcess={{identifier: __PAVICS_RUN_WORKFLOW_IDENTIFIER__}}
              showDialog={this.showDialog}
              visualize={this.props.visualize}
              workflow={this.props.workflow}
              workflowActions={this.props.workflowActions}
              workflowAPI={this.props.workflowAPI}
              workflowAPIActions={this.props.workflowAPIActions} /> : null
        }
        {
          (this.state.activeTab === PROCESS_TAB_VALUE) ?
            <WpsProcessStepper
              sectionActions={this.props.sectionActions}
              jobAPIActions={this.props.jobAPIActions}
              project={this.props.project}
              visualize={this.props.visualize}
              workflow={this.props.workflow}
              workflowActions={this.props.workflowActions}
            /> : null
        }
        <Dialog
          open={this.state.dialogOpened}
          onClose={this.closeDialog}>
          <DialogTitle>
            {this.state.dialogTitle}
          </DialogTitle>
          <DialogContent>
            <Typography>
              {this.state.dialogContent}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained"
                    color="primary"
                    onClick={this.closeDialog}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

    );
  }
}

export default withStyles(styles)(WorkflowWizard)

