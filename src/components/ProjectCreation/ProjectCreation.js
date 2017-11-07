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
    this._onCreateProject = this._onCreateProject.bind(this);
    this.state = {
      projectName: ''
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

  _onCreateProject(event, value){
    this.props.projectAPIActions.createProject({
        name: this.state.projectName,
        researcherId: 1
    });
    this.setState({
      projectName: ''
    });
    // ALERT
  }

  render () {
    return (
      <div className={classes['ProjectCreation']}>
        <Paper style={{marginTop: 20}}>
          <div className="container">
            <TextField
              hintText="Define a name"
              fullWidth={true}
              onChange={(event, value) => this._onSetNewProjectName(value)}
              floatingLabelText="Project name" />
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
