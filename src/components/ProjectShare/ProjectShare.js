import React from 'react';
import PropTypes from 'prop-types';
import classes from './ProjectShare.scss';
import ConfirmDialog from './../../components/ConfirmDialog';
import Paper from'@material-ui/core/Paper';
import Button from'@material-ui/core/Button';
import TextField from'@material-ui/core/TextField';
import {Radio, RadioGroup} from'@material-ui/core/Radio';
import Select from'@material-ui/core/Select';
import MenuItem from'@material-ui/core/MenuItem';
import Checkbox from'@material-ui/core/Checkbox';
import ListSubheader from'@material-ui/core/ListSubheader';

export class ProjectShare extends React.Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    projectAPIActions: PropTypes.object.isRequired,
    sessionManagement: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.onUpdateStateKey = this.onUpdateStateKey.bind(this);
    this.onTogglePermission = this.onTogglePermission.bind(this);
    this.onShareProject = this.onShareProject.bind(this);
    this.onConfirmedProjectSharing = this.onConfirmedProjectSharing.bind(this);
    this.onCloseDialogProjectSharing = this.onCloseDialogProjectSharing.bind(this);
    this.state = {
      readPermission: true,
      writePermission: false,
      type: 'user',
      user: '',
      group: '',
      confirmShareDialogOpened: false
    };
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillMount() {

  }

  onUpdateStateKey(key, value){
    let newState = {};
    newState[key] = value;
    this.setState(newState);
  }

  onTogglePermission(permission){
    let newState = {};
    newState[permission] = !this.state[permission];
    this.setState(newState)
  }

  updateCheck() {
    this.setState((oldState) => {
      return {
        checked: !oldState.checked,
      };
    });
  }

  onShareProject(){
    this.setState({
      confirmShareDialogOpened: true
    });
  }

  onConfirmedProjectSharing(project){
    this.onCloseDialogProjectSharing();
    // TODO: Share project
    if(this.state.type === 'user'){
      this.props.projectAPIActions.shareToUserProject({
        id: this.props.project.currentProject.id,
        user: this.state.user,
        readPermission: this.state.readPermission,
        writePermission: this.state.writePermission
      })
    }else if(this.state.type === 'group'){
      this.props.projectAPIActions.shareToGroupProject({
        id: this.props.project.currentProject.id,
        group: this.state.group,
        readPermission: this.state.readPermission,
        writePermission: this.state.writePermission
      })
    }
  }

  onCloseDialogProjectSharing() {
    this.setState({
      confirmShareDialogOpened: false
    });
  }

  render () {
    return (
      <div className={classes['ProjectShare']}>
        <Paper style={{marginTop: 20}}>
          <div className="container">
            <h4>Share to</h4>
            <RadioGroup
              name="type"
              defaultSelected={this.state.type}
              style={{marginTop: '15px'}}
              onChange={(event, value) => {this.onUpdateStateKey('type', value)}}>
              <Radio
                id="cy-share-type-user-rb"
                value="user"
                label="User"
              />
              <Radio
                id="cy-share-type-group-rb"
                value="group"
                label="Group users"
              />
            </RadioGroup>
            {
              (this.state.type === 'user')?
              <TextField
                id="cy-project-share-user-tf"
                value={this.state.user}
                fullWidth={true}
                onChange={(event, value) => this.onUpdateStateKey('user', value)}
                helperText="Username"
                label="Define username" />:
              <Select
                id="cy-group-selector"
                fullWidth
                value={this.state.group}
                onChange={(event, key, value) => this.onUpdateStateKey('group', value)}
                helperText="Group name"
                label="Select a user group">
                {this.props.sessionManagement.sessionStatus.user.groups.map((group, i) => {
                  return (
                    <MenuItem
                      data-cy-item-group={group}
                      key={i}
                      value={group}
                      primaryText={group} />
                  );
                })}
              </Select>
            }
            <h4>Project permissions to be shared</h4>
            <Checkbox
              id="cy-read-permission-cb"
              label="READ"
              disabled
              checked={this.state.readPermission}
              onCheck={() => this.onTogglePermission('readPermission')}/>
            <Checkbox
              id="cy-write-permission-cb"
              label="WRITE"
              checked={this.state.writePermission}
              onCheck={() => this.onTogglePermission('writePermission')}/>
          </div>
        </Paper>

        <Button variant="contained"
          id="cy-share-project-btn"
          onClick={() => this.onShareProject()}
          label="Share project"
          secondary={true}
          disabled={(this.state.type === 'user' && !this.state.user.length) || (this.state.type === 'group' && !this.state.group.length)}
          style={{marginTop: 20}} />
        <ConfirmDialog
          isOpen={this.state.confirmShareDialogOpened}
          affectedResource={this.props.project.currentProject}
          onDialogConfirmed={this.onConfirmedProjectSharing}
          onCloseDialog={this.onCloseDialogProjectSharing}
          dialogContent={
            (this.state.type === 'user') ?
              `Do you really want to share the project "${this.props.project.currentProject.name}" and all its content to user "${this.state.user}"?`:
              `Do you really want to share the project "${this.props.project.currentProject.name}" and all its content to all users of group "${this.state.group}"?`
            }>
        </ConfirmDialog>
      </div>
    )
  }
}

export default ProjectShare
