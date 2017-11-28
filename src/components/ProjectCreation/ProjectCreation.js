import React from 'react'
import classes from './ProjectCreation.scss';
import * as constants from '../../constants';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export class ProjectCreation extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    projectActions: React.PropTypes.object.isRequired,
    projectAPI: React.PropTypes.object.isRequired,
    projectAPIActions: React.PropTypes.object.isRequired
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
    this.props.projectAPIActions.createProject({
        name: this.state.projectName,
        description: this.state.projectDescription,
        researcherId: 1
    });
    this.setState({
      projectName: '',
      projectDescription: ''
    });
    // ALERT
  }

  render () {
    return (
      <div className={classes['ProjectCreation']}>
        <Paper style={{marginTop: 20}}>
          <div className="container">
            <TextField
              hintText="Define a project name"
              fullWidth={true}
              onChange={(event, value) => this._onSetNewProjectName(value)}
              floatingLabelText="Project name" />
            <TextField
              hintText="Write a project description"
              fullWidth={true}
              multiLine={true}
              rows={1}
              rowsMax={7}
              onChange={(event, value) => this._onSetNewProjectDescription(value)}
              floatingLabelText="Project description" />
          </div>
        </Paper>

        <RaisedButton
          onClick={this._onCreateProject}
          label="Create new project"
          disabled={!this.state.projectName.length}
          style={{marginTop: 20}} />
      </div>
    )
  }
}

export default ProjectCreation
