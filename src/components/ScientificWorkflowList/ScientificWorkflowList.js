import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from'@material-ui/core/Paper';
import CircularProgress from'@material-ui/core/CircularProgress';
import { List, ListItem } from'@material-ui/core/List';
// import IconMenu from'@material-ui/core/IconMenu';
import MenuItem from'@material-ui/core/MenuItem';
import IconButton from'@material-ui/core/IconButton';
import Dialog from'@material-ui/core/Dialog';
import Button from'@material-ui/core/Button';
import Remove from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Create from '@material-ui/icons/Create';
import Build from '@material-ui/icons/Build';
import DeviceHub from '@material-ui/icons/DeviceHub';
import Pagination from '../Pagination';
import * as constants from '../../constants';
import ConfirmDialog from './../../components/ConfirmDialog';
import TextField from'@material-ui/core/TextField';
import ScientificWorkflowTextInput from './../../components/ScientificWorkflowTextInput';

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
    this._onPageChanged = this._onPageChanged.bind(this);
    this._onOpenConfirmWorkflowDeletionDialog = this._onOpenConfirmWorkflowDeletionDialog.bind(this);
    this._onConfirmedWorkflowDeletion = this._onConfirmedWorkflowDeletion.bind(this);
    this._onRunWorkflowClicked = this._onRunWorkflowClicked.bind(this);
    this._onEditWorkflowClicked = this._onEditWorkflowClicked.bind(this);
    this._onCloseEditionDialog = this._onCloseEditionDialog.bind(this);
    this._onEditWorkflowSaved = this._onEditWorkflowSaved.bind(this);
    this.state = {
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[WORKFLOW_PER_PAGE_INITIAL_INDEX],
      isConfirmDeleteDialogOpened: false,
      confirmDeleteDialogContent: '',
      confirmDeleteDialogResource: null,
      isEditionDialogOpened: false,
      editedWorkflow: ''
    };
  }

  _onOpenConfirmWorkflowDeletionDialog (workflow) {
    this.setState({
      isConfirmDeleteDialogOpened: true,
      confirmDeleteDialogContent: `Do you really want to delete the workflow '${workflow.json.name}'?`,
      confirmDeleteDialogResource: workflow
    });
  }

  _onConfirmedWorkflowDeletion (workflow) {
    if(this.props.project.currentProject.id) {
      this.props.workflowAPIActions.deleteWorkflow({projectId: this.props.project.currentProject.id, id: workflow.id});
      this.setState({isConfirmDeleteDialogOpened: false});
    }
  }


  _onPageChanged (pageNumber, numberPerPage) {
    this.setState({
      pageNumber: pageNumber,
      numberPerPage: numberPerPage
    });
  }

  _onRunWorkflowClicked (workflow) {
    // Deep clone workflow object so modifications (provider names, url, inputs) won't affect it's state if reloaded from the list
    this.props.goToConfigureAndRunStep(JSON.parse(JSON.stringify(workflow)));
  }

  _onEditWorkflowClicked (workflow) {
    this.editedCompleteWorkflow = workflow;
    this.setState({
      isEditionDialogOpened: true,
      editedWorkflow: JSON.stringify(workflow.json, null, "\t")
    });
  }

  _onEditWorkflowSaved () {
    let parsed = this.workflowTextInput.tryParseJson();
    if(parsed && this.workflowTextInput.validateAdvancedWorkflowSchema(parsed)) {
      this.props.workflowAPIActions.updateWorkflow({
        id: this.editedCompleteWorkflow.id,
        name: parsed.name,
        projectId: this.props.project.currentProject.id,
        json: parsed
      });
      this._onCloseEditionDialog();
    }
  }

  _onCloseEditionDialog() {
    this.setState({
      isEditionDialogOpened: false,
      editedWorkflow: null
    });
  }

  render () {
    if (this.props.workflowAPI.isFetching) {
      return (
        <div><Paper><CircularProgress /></Paper></div>
      );
    } else if (this.props.workflowAPI.items.length > 0) {
      let start = (this.state.pageNumber - 1) * this.state.numberPerPage;
      let paginated = this.props.workflowAPI.items.slice(start, start + this.state.numberPerPage);
      return (
        <div id="cy-workflow-list">
          <Paper>
            <List>
              {
                paginated.map((workflow, i) => {
                  return (
                    <div key={i}>
                      <ListItem
                        className="cy-workflow-item"
                        style={{width: '98%'}}
                        primaryText={workflow.json.name || workflow.json}
                        leftIcon={<DeviceHub />} key={i}
                        /*rightIconButton={
                          <IconMenu iconButtonElement={
                            <IconButton
                              className="cy-actions-btn"
                              touch={true}
                              tooltip="Actions"
                              tooltipPosition="bottom-left">
                              <MoreVertIcon />
                            </IconButton>}>
                            <MenuItem id="cy-configure-run-item" leftIcon={<Build />} onClick={() => this._onRunWorkflowClicked(workflow)}>Configure & Run</MenuItem>
                            <MenuItem id="cy-edit-item" leftIcon={<Create />} onClick={() => this._onEditWorkflowClicked(workflow)}>Edit</MenuItem>
                            <MenuItem id="cy-delete-item" leftIcon={<Remove />} onClick={() => {this._onOpenConfirmWorkflowDeletionDialog(workflow)}}>Delete</MenuItem>
                            </IconMenu>
                        }*//>
                      </div>
                  );
                })
              }
            </List>
            <Pagination
              total={this.props.workflowAPI.items.length}
              initialPerPageOptionIndex={WORKFLOW_PER_PAGE_INITIAL_INDEX}
              perPageOptions={constants.PER_PAGE_OPTIONS}
              onChange={this._onPageChanged}/>
            <ConfirmDialog
              isOpen={this.state.isConfirmDeleteDialogOpened}
              affectedResource={this.state.confirmDeleteDialogResource}
              onDialogConfirmed={this._onConfirmedWorkflowDeletion}
              onCloseDialog={this._onCloseEditionDialog}
              dialogContent={this.state.confirmDeleteDialogContent}>
            </ConfirmDialog>
            <Dialog
              contentStyle={{
                width: '65%',
                maxWidth: 'none'
              }}
              title="Edit Workflow"
              modal={false}
              open={this.state.isEditionDialogOpened}
              onRequestClose={this._onCloseEditionDialog}
              actions={[
                <Button variant="contained"
                  id="cy-confirm-cancel-btn"
                  label="Cancel"
                  keyboardFocused={false}
                  onClick={this._onCloseEditionDialog}
                />,
                <Button variant="contained"
                  id="cy-confirm-save-btn"
                  label="Save"
                  primary={true}
                  style={{marginLeft: '10px'}}
                  keyboardFocused={true}
                  onClick={() => {this._onEditWorkflowSaved()}}
                />
              ]}>
              <ScientificWorkflowTextInput
                ref={instance => { this.workflowTextInput = instance; }}
                workflow={this.state.editedWorkflow}/>
            </Dialog>
          </Paper>
        </div>
      );
    } else {
      return (
        <div>
          <Paper id="cy-no-workflow-found" style={style.noWorkflows}>No workflows yet</Paper>
        </div>
      );
    }
  }
}
