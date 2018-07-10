import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from'@material-ui/core/Paper';
import CircularProgress from'@material-ui/core/CircularProgress';
import Dialog from'@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from'@material-ui/core/List';
import ListItem from'@material-ui/core/ListItem';
import ListSubheader from'@material-ui/core/ListSubheader';
import ListItemIcon from'@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from'@material-ui/core/IconButton';
import Button from'@material-ui/core/Button';
import Remove from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Create from '@material-ui/icons/Create';
import Build from '@material-ui/icons/Build';
import DeviceHub from '@material-ui/icons/DeviceHub';
import TextField from'@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import ScientificWorkflowTextInput from '../ScientificWorkflowTextInput';
import ConfirmDialog from '../ConfirmDialog';
import Pagination from '../Pagination';
import * as constants from '../../constants';

const style = {
  noWorkflows: {
    padding: '20px'
  }
};
const WORKFLOW_PER_PAGE_INITIAL_INDEX = 1;
export default class ScientificWorkflowList extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    workflowAPI: PropTypes.object.isRequired,
    workflowAPIActions: PropTypes.object.isRequired,
    goToConfigureAndRunStep: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.workflowTextInput = null;
    this.editedCompleteWorkflow = null;
    this.state = {
      anchor: null,
      currentWorkflow: null,
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[WORKFLOW_PER_PAGE_INITIAL_INDEX],
      isConfirmDeleteDialogOpened: false,
      confirmDeleteDialogContent: '',
      confirmDeleteDialogResource: null,
      isEditionDialogOpened: false,
      editedWorkflow: ''
    };
  }

  onOpenConfirmWorkflowDeletionDialog = () => {
    this.onMenuClosed();
    this.setState({
      isConfirmDeleteDialogOpened: true,
      confirmDeleteDialogContent: `Do you really want to delete the workflow '${this.state.currentWorkflow.json.name}'?`,
      confirmDeleteDialogResource: this.state.currentWorkflow
    });
  };

  onRunWorkflowClicked = () => {
    this.onMenuClosed();
    // Deep clone workflow object so modifications (provider names, url, inputs) won't affect it's state if reloaded from the list
    this.props.goToConfigureAndRunStep(JSON.parse(JSON.stringify(this.state.currentWorkflow)));
  };

  onEditWorkflowClicked = () => {
    this.onMenuClosed();
    this.editedCompleteWorkflow = this.state.currentWorkflow;
    this.setState({
      isEditionDialogOpened: true,
      editedWorkflow: JSON.stringify(this.state.currentWorkflow.json, null, "\t")
    });
  };

  onCloseConfirmDeleteDialog = () => {
    this.setState({
      isConfirmDeleteDialogOpened: false
    });
  };

  onConfirmedWorkflowDeletion = (workflow) => {
    if(this.props.project.currentProject.id) {
      this.props.workflowAPIActions.deleteWorkflow({projectId: this.props.project.currentProject.id, id: workflow.id});
      this.setState({isConfirmDeleteDialogOpened: false});
    }
  };

  onPageChanged = (pageNumber, numberPerPage) => {
    this.setState({
      pageNumber: pageNumber,
      numberPerPage: numberPerPage
    });
  };

  onEditWorkflowSaved = () => {
    let parsed = this.workflowTextInput.tryParseJson();
    if(parsed && this.workflowTextInput.validateAdvancedWorkflowSchema(parsed)) {
      this.props.workflowAPIActions.updateWorkflow({
        id: this.editedCompleteWorkflow.id,
        name: parsed.name,
        projectId: this.props.project.currentProject.id,
        json: parsed
      });
      this.onCloseEditionDialog();
    }
  };

  onCloseEditionDialog = () => {
    this.setState({
      isEditionDialogOpened: false,
      editedWorkflow: null
    });
  };

  onMenuClosed = event => {
    this.setState({
      anchor: null,
      currentWorkflow: null
    });
    if(event) event.stopPropagation();
  };

  onMenuClicked = (event, workflow) => {
    this.setState({
      anchor: event.currentTarget,
      currentWorkflow: workflow
    });
    event.stopPropagation();
  };

  render () {
    const { anchor } = this.state;
    if (this.props.workflowAPI.isFetching) {
      return (
        <Paper><CircularProgress /></Paper>
      );
    } else if (this.props.workflowAPI.items.length > 0) {
      let start = (this.state.pageNumber - 1) * this.state.numberPerPage;
      let paginated = this.props.workflowAPI.items.slice(start, start + this.state.numberPerPage);
      return (
        <div id="cy-workflow-list">
          <Paper>
            <List>
              <ListSubheader>Project workflow(s)</ListSubheader>
              {
                paginated.map((workflow, i) => {
                  return (
                    <div key={i}>
                      <ListItem
                        ContainerProps={{
                          className: "cy-workflow-item"
                        }}
                        style={{width: '98%'}}
                        key={i}>
                        <ListItemIcon>
                          <DeviceHub />
                        </ListItemIcon>
                        <ListItemText
                          inset
                          primary={workflow.json.name || workflow.json} />
                        <ListItemSecondaryAction>
                          <IconButton
                            className="cy-actions-btn"
                            aria-label="Actions"
                            aria-owns={anchor ? 'workflow-menu-actions' : null}
                            aria-haspopup="true"
                            onClick={(event) => this.onMenuClicked(event, workflow)}>
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </div>
                  );
                })
              }
            </List>
            <Menu
              id="workflow-menu-actions"
              anchorEl={anchor}
              open={Boolean(anchor)}
              onClose={this.onMenuClosed}
              PaperProps={{
                style: {
                  width: 200
                },
              }}>
              <MenuItem id="cy-configure-run-item" onClick={() => this.onRunWorkflowClicked()}>
                <ListItemIcon>
                  <Build />
                </ListItemIcon>
                <ListItemText inset primary="Configure & Run" />
              </MenuItem>
              <MenuItem id="cy-edit-item" onClick={() => this.onEditWorkflowClicked()}>
                <ListItemIcon>
                  <Create />
                </ListItemIcon>
                <ListItemText inset primary="Edit" />
              </MenuItem>
              <MenuItem id="cy-delete-item" onClick={() => {this.onOpenConfirmWorkflowDeletionDialog()}}>
                <ListItemIcon>
                  <Remove />
                </ListItemIcon>
                <ListItemText inset primary="Delete" />
              </MenuItem>
            </Menu>
            <Pagination
              total={this.props.workflowAPI.items.length}
              initialPerPageOptionIndex={WORKFLOW_PER_PAGE_INITIAL_INDEX}
              perPageOptions={constants.PER_PAGE_OPTIONS}
              onChange={this.onPageChanged}/>
            <ConfirmDialog
              isOpen={this.state.isConfirmDeleteDialogOpened}
              affectedResource={this.state.confirmDeleteDialogResource}
              onDialogConfirmed={this.onConfirmedWorkflowDeletion}
              onCloseDialog={this.onCloseConfirmDeleteDialog}
              dialogContent={this.state.confirmDeleteDialogContent}>
            </ConfirmDialog>
            <Dialog
              open={this.state.isEditionDialogOpened}
              onClose={this.onCloseEditionDialog}>
              <DialogTitle>
                Edit Workflow
              </DialogTitle>
              <DialogContent style={{width: '600px'}}>
                <ScientificWorkflowTextInput
                  ref={instance => { this.workflowTextInput = instance; }}
                  workflow={this.state.editedWorkflow}/>
              </DialogContent>
              <DialogActions>
                <Button variant="contained"
                        id="cy-confirm-cancel-btn"
                        color="secondary"
                        onClick={this.onCloseEditionDialog}>
                  Cancel
                </Button>,
                <Button variant="contained"
                        id="cy-confirm-save-btn"
                        color="primary"
                        style={{marginLeft: '10px'}}
                        onClick={() => {this.onEditWorkflowSaved()}}>
                  <SaveIcon />Save
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </div>
      );
    } else {
      return (
        <Paper id="cy-no-workflow-found" style={style.noWorkflows}>No workflows yet</Paper>
      );
    }
  }
}
