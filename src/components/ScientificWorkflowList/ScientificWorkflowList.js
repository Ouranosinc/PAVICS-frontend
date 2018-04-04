import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import { List, ListItem } from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import { grey400 } from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Remove from 'material-ui/svg-icons/action/delete';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Create from 'material-ui/svg-icons/content/create';
import Build from 'material-ui/svg-icons/action/build';
import DeviceHub from 'material-ui/svg-icons/hardware/device-hub';
import Pagination from '../Pagination';
import * as constants from '../../constants';
import ConfirmDialog from './../../components/ConfirmDialog';
import TextField from 'material-ui/TextField';
import ScientificWorkflowTextInput from './../../components/ScientificWorkflowTextInput';

const style = {
  noWorkflows: {
    padding: '20px'
  }
};
export default class ScientificWorkflowList extends Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    workflowAPI: React.PropTypes.object.isRequired,
    workflowAPIActions: React.PropTypes.object.isRequired,
    goToConfigureAndRunStep: React.PropTypes.func.isRequired
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
      numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX],
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
    this.props.workflowAPIActions.deleteWorkflow({ id: workflow.id });
    this.setState({
      isConfirmDeleteDialogOpened: false
    });
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
        <div>
          <Paper>
            <List>
              {
                paginated.map((workflow, i) => {
                  return (
                    <div>
                      <ListItem
                        style={{width: '98%'}}
                        primaryText={workflow.json.name || workflow.json}
                        leftIcon={<DeviceHub />} key={i}
                        rightIconButton={
                          <IconMenu iconButtonElement={
                            <IconButton
                              touch={true}
                              tooltip="Actions"
                              tooltipPosition="bottom-left">
                              <MoreVertIcon color={grey400} />
                            </IconButton>}>
                            <MenuItem leftIcon={<Build />} onTouchTap={() => this._onRunWorkflowClicked(workflow)}>Configure & Run</MenuItem>
                            <MenuItem leftIcon={<Create />} onTouchTap={() => this._onEditWorkflowClicked(workflow)}>Edit</MenuItem>
                            <MenuItem leftIcon={<Remove />} onTouchTap={() => {this._onOpenConfirmWorkflowDeletionDialog(workflow)}}>Delete</MenuItem>
                            </IconMenu>
                        }/>
                      </div>
                  );
                })
              }
            </List>
            <Pagination
              total={this.props.workflowAPI.items.length}
              initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
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
                <RaisedButton
                  label="Cancel"
                  keyboardFocused={false}
                  onTouchTap={this._onCloseEditionDialog}
                />,
                <RaisedButton
                  label="Save"
                  primary={true}
                  style={{marginLeft: '10px'}}
                  keyboardFocused={true}
                  onTouchTap={() => {this._onEditWorkflowSaved()}}
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
        <div><Paper style={style.noWorkflows}>No workflows yet</Paper></div>
      );
    }
  }
}
