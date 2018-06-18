import React from 'react';
import PropTypes from 'prop-types';
import classes from './ProjectCreation.scss';
import * as constants from '../../constants';
import Paper from'@material-ui/core/Paper';
import Button from'@material-ui/core/Button';
import TextField from'@material-ui/core/TextField';
import { NotificationManager } from 'react-notifications';

export class ProjectCreation extends React.Component {
  static propTypes = {
    sessionManagement: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    projectActions: PropTypes.object.isRequired,
    projectAPI: PropTypes.object.isRequired,
    projectAPIActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this._onSetNewProjectName = this._onSetNewProjectName.bind(this);
    this._onSetNewProjectDescription = this._onSetNewProjectDescription.bind(this);
    this._onCreateProject = this._onCreateProject.bind(this);
    this.state = {
      projectName: '',
      projectDescription: ''
    };
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillMount() {

  }

  _onSetNewProjectName(name){
    this.setState({
      projectName: name
    })
  }

  _onSetNewProjectDescription(desc){
    this.setState({
      projectDescription: desc
    })
  }
  _onCreateProject(event, value){
    if(this.props.sessionManagement.sessionStatus.user && this.props.sessionManagement.sessionStatus.user.username.length) {
      this.props.projectAPIActions.createProject({
        name: this.state.projectName,
        description: this.state.projectDescription,
        owner: this.props.sessionManagement.sessionStatus.user.username
      });
      this.setState({
        projectName: '',
        projectDescription: ''
      });
    } else {
      NotificationManager.warning(`You must be logged to create a project.`, 'Warning', 10000);
    }
  }

  render () {
    return (
      <div className={classes['ProjectCreation']}>
        <Paper style={{marginTop: 20}}>
          <div className="container">
            <TextField
              id="cy-project-name-tf"
              helperText="Define a project name"
              fullWidth={true}
              onChange={(event, value) => this._onSetNewProjectName(value)}
              label="Project name" />
            <TextField
              id="cy-project-description-tf"
              helperText="Write a project description"
              fullWidth={true}
              multiLine={true}
              rows={1}
              rowsMax={7}
              onChange={(event, value) => this._onSetNewProjectDescription(value)}
              label="Project description" />
          </div>
        </Paper>

        <Button variant="contained"
          id="cy-create-project-btn"
          onClick={this._onCreateProject}
          label="Create new project"
          disabled={!this.state.projectName || !this.state.projectName.length}
          style={{marginTop: 20}} />
      </div>
    )
  }
}

export default ProjectCreation
