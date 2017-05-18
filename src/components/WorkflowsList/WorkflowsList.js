import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import { List, ListItem } from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import { grey400 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import Remove from 'material-ui/svg-icons/action/delete';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Build from 'material-ui/svg-icons/action/build';
import DeviceHub from 'material-ui/svg-icons/hardware/device-hub';
import Pagination from '../Pagination';
import * as constants from '../../constants';
const style = {
  container: {
    margin: '20px'
  },
  noWorkflows: {
    padding: '20px'
  }
};
export default class WorkflowsList extends Component {
  static propTypes = {
    workflows: React.PropTypes.object.isRequired,
    deleteWorkflow: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onPageChanged = this.onPageChanged.bind(this);
    this.openConfirmWorkflowDeletionDialog = this.openConfirmWorkflowDeletionDialog.bind(this);
    this.makeConfirmWorkflowDeletionDialogActions = this.makeConfirmWorkflowDeletionDialogActions.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.state = {
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX],
      dialogOpened: false,
      dialogContent: '',
      dialogActions: []
    };
  }

  openConfirmWorkflowDeletionDialog (id, name) {
    this.setState({
      dialogOpened: true,
      dialogContent: 'Voulez-vous vraiment supprimer le workflow ' + name + '?',
      dialogActions: this.makeConfirmWorkflowDeletionDialogActions(id)
    });
  }

  closeDialog () {
    this.setState({
      dialogOpened: false
    });
  }

  makeConfirmWorkflowDeletionDialogActions (id) {
    return [
      <FlatButton
        label="Cancel"
        primary={false}
        keyboardFocused={true}
        onTouchTap={this.closeDialog}
      />,
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={false}
        onTouchTap={() => {this.props.deleteWorkflow(id)}}
      />
    ]
  }

  onPageChanged (pageNumber, numberPerPage) {
    this.setState({
      pageNumber: pageNumber,
      numberPerPage: numberPerPage
    });
  }

  render () {
    if (this.props.workflows.isFetching) {
      return (
        <div style={style.container}><Paper><CircularProgress /></Paper></div>
      );
    } else if (this.props.workflows.items.length > 0) {
      let start = (this.state.pageNumber - 1) * this.state.numberPerPage;
      let paginated = this.props.workflows.items.slice(start, start + this.state.numberPerPage);
      return (
        <div style={style.container}>
          <Paper>
            <List>
              {
                paginated.map((workflow, i) => {
                  console.log(workflow);
                  return (
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
                          <MenuItem onTouchTap={() => {alert('run')}} leftIcon={<Build />}>Run</MenuItem>
                          <MenuItem onTouchTap={() => {this.openConfirmWorkflowDeletionDialog(workflow.id, workflow.json.name)}} leftIcon={<Remove />}>Delete</MenuItem>
                        </IconMenu>
                      }/>
                  );
                })
              }
            </List>
            <Pagination
              total={this.props.workflows.items.length}
              initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
              perPageOptions={constants.PER_PAGE_OPTIONS}
              onChange={this.onPageChanged}/>
          </Paper>
          <Dialog
            title="Attention"
            modal={false}
            open={this.state.dialogOpened}
            onRequestClose={this.closeDialog}
            actions={this.state.dialogActions}>
            {this.state.dialogContent}
          </Dialog>
        </div>
      );
    } else {
      return (
        <div style={style.container}><Paper style={style.noWorkflows}>No workflows yet</Paper></div>
      );
    }
  }
}
