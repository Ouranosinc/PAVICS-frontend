import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import { List, ListItem } from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import { grey400 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import Remove from 'material-ui/svg-icons/action/delete';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Create from 'material-ui/svg-icons/content/create';
import Build from 'material-ui/svg-icons/action/build';
import DeviceHub from 'material-ui/svg-icons/hardware/device-hub';
import Pagination from '../Pagination';
import * as constants from '../../constants';
import ConfirmDialog from './../../components/ConfirmDialog';

const style = {
  noWorkflows: {
    padding: '20px'
  }
};
export default class ScientificWorkflowList extends Component {
  static propTypes = {
    workflowAPI: React.PropTypes.object.isRequired,
    workflowAPIActions: React.PropTypes.object.isRequired,
    goToConfigureAndRunStep: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onPageChanged = this.onPageChanged.bind(this);
    this._openConfirmWorkflowDeletionDialog = this._openConfirmWorkflowDeletionDialog.bind(this);
    this._onConfirmedWorkflowDeletion = this._onConfirmedWorkflowDeletion.bind(this);
    this._onRunWorkflowClicked = this._onRunWorkflowClicked.bind(this);
    this._onEditWorkflowClicked = this._onEditWorkflowClicked.bind(this);
    this.state = {
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX],
      dialogOpened: false,
      dialogContent: '',
      dialogResource: null
    };
  }

  _openConfirmWorkflowDeletionDialog (workflow) {
    this.setState({
      dialogOpened: true,
      dialogContent: 'Do you really want to delete the workflow ' +  workflow.json.name + '?',
      dialogResource: workflow
    });
  }

  _onConfirmedWorkflowDeletion (workflow) {
    this.props.workflowAPIActions.deleteWorkflow({ id: workflow.id });
    this.setState({
      dialogOpened: false
    });
  }


  onPageChanged (pageNumber, numberPerPage) {
    this.setState({
      pageNumber: pageNumber,
      numberPerPage: numberPerPage
    });
  }

  _onRunWorkflowClicked (workflow) {
    // Deep clone workflow object so modifications (provider names, url, inputs) won't affect it's state if reloaded from the list
    this.props.goToConfigureAndRunStep(JSON.parse(JSON.stringify(workflow)));
  }

  _onEditWorkflowClicked () {
    this.setState({
      dialogOpened: true,
      dialogContent: 'editing workflow'
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
                            <MenuItem leftIcon={<Create />} onTouchTap={this._onEditWorkflowClicked}>Edit</MenuItem>
                            <MenuItem leftIcon={<Remove />} onTouchTap={() => {this._openConfirmWorkflowDeletionDialog(workflow)}}>Delete</MenuItem>
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
              onChange={this.onPageChanged}/>
            <ConfirmDialog
              isOpen={this.state.dialogOpened}
              affectedResource={this.state.dialogResource}
              onDialogConfirmed={this._onConfirmedWorkflowDeletion}
              dialogContent={this.state.dialogContent}>
            </ConfirmDialog>
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
