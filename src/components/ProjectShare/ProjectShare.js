import React from 'react';
import PropTypes from 'prop-types';
import classes from './ProjectShare.scss';
import ConfirmDialog from './../../components/ConfirmDialog';
import Paper from'@material-ui/core/Paper';
import Button from'@material-ui/core/Button';
import TextField from'@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from'@material-ui/core/Select';
import MenuItem from'@material-ui/core/MenuItem';
import Checkbox from'@material-ui/core/Checkbox';
import ShareIcon from'@material-ui/icons/Share';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export class ProjectShare extends React.Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    projectAPIActions: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
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
          <form className="container">
            <Typography variant='subheading' gutterBottom>
              Share project to
            </Typography>
            <RadioGroup
              name="type"
              value={this.state.type}
              style={{marginTop: '15px'}}
              onChange={(event, value) => {this.onUpdateStateKey('type', value)}}>
              <FormControlLabel value="user" control={<Radio id="cy-share-type-user" color="secondary" />} label="User" />
              <FormControlLabel value="group" control={<Radio id="cy-share-type-group" color="secondary" />} label="Group users" />
            </RadioGroup>
            {
              (this.state.type === 'user')?
              <TextField
                id="cy-project-share-user-tf"
                value={this.state.user}
                fullWidth
                onChange={(event) => this.onUpdateStateKey('user', event.target.value)}
                label="Define username" />:
              <Select
                SelectDisplayProps={{
                  id: 'cy-group-select'
                }}
                fullWidth
                value={this.state.group}
                onChange={(event) => this.onUpdateStateKey('group', event.target.value)}
                label="Select a user group">
                {this.props.session.sessionStatus.user.groups.map((group, i) => {
                  return (
                    <MenuItem
                      data-cy-item-group={group}
                      key={i}
                      value={group}>
                      {group}
                    </MenuItem>
                  );
                })}
              </Select>
            }
            <Typography style={{marginTop: '15px'}} variant='subheading' gutterBottom>
              Project permissions to be shared:
            </Typography>
            <FormControlLabel
              style={{width: '100%'}}
              label="READ"
              control={
                <Checkbox
                  id="cy-read-permission-cb"
                  disabled
                  checked={this.state.readPermission}
                  onChange={() => this.onTogglePermission('readPermission')}/>
              } />
            <FormControlLabel
              style={{width: '100%'}}
              label="WRITE"
              control={<Checkbox
                id="cy-write-permission-cb"
                checked={this.state.writePermission}
                onChange={() => this.onTogglePermission('writePermission')}/>
              } />

            <Button
              variant="contained"
              id="cy-share-project-btn"
              onClick={() => this.onShareProject()}
              color="secondary"
              disabled={(this.state.type === 'user' && !this.state.user.length) || (this.state.type === 'group' && !this.state.group.length)}>
              <ShareIcon />Share project
            </Button>
          </form>
        </Paper>

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
