import React from 'react'
import classes from './ProjectEditor.scss';
import * as constants from '../../constants';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export class ProjectEditor extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    projectActions: React.PropTypes.object.isRequired,
    projectAPI: React.PropTypes.object.isRequired,
    projectAPIActions: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this._onSetProjectName = this._onSetProjectName.bind(this);
    this._onSetProjectDescription = this._onSetProjectDescription.bind(this);
    this._onSaveProject = this._onSaveProject.bind(this);
    this.state = {
      projectName: '',
      projectDescription: ''
    };
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.project && nextProps.project.currentProject.id !== this.props.project.currentProject.id) {
      this.setState({
        projectName: nextProps.project.currentProject.name,
        projectDescription: nextProps.project.currentProject.description
      });
    }
  }

  componentWillMount() {
    if (this.props.project && this.props.project.currentProject && this.props.project.currentProject.id){
      this.setState({
        projectName: this.props.project.currentProject.name,
        projectDescription: this.props.project.currentProject.description
      });
    }
  }

  _onSetProjectName(name){
    this.setState({
      projectName: name
    })
  }

  _onSetProjectDescription(desc){
    this.setState({
      projectDescription: desc
    })
  }
  _onSaveProject(event, value){
    this.props.projectAPIActions.updateProject({
      id: this.props.project.currentProject.id,
      name: this.state.projectName,
      description: this.state.projectDescription,
    });
  }

  render () {
    return (
      <div className={classes['ProjectCreation']}>
        <Paper style={{marginTop: 20}}>
          <div className="container">
            <TextField
              hintText="Define a name"
              value={this.state.projectName}
              fullWidth={true}
              onChange={(event, value) => this._onSetProjectName(value)}
              floatingLabelText="Project name" />
            <TextField
              hintText="Write a project description"
              value={this.state.projectDescription}
              fullWidth={true}
              multiLine={true}
              rows={1}
              rowsMax={7}
              onChange={(event, value) => this._onSetProjectDescription(value)}
              floatingLabelText="Project description" />
          </div>
        </Paper>

        <RaisedButton
          onClick={this._onSaveProject}
          label="Save project properties"
          disabled={!this.state.projectName.length}
          style={{marginTop: 20}} />
      </div>
    )
  }
}

export default ProjectEditor
