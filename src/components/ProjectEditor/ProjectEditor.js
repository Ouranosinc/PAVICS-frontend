import React from 'react';
import PropTypes from 'prop-types';
import classes from './ProjectEditor.scss';
import ConfirmDialog from './../../components/ConfirmDialog';
import Paper from'@material-ui/core/Paper';
import Button from'@material-ui/core/Button';
import TextField from'@material-ui/core/TextField';
import Checkbox from'@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';

export class ProjectEditor extends React.Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    projectActions: PropTypes.object.isRequired,
    projectAPI: PropTypes.object.isRequired,
    projectAPIActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this._onSetProjectName = this._onSetProjectName.bind(this);
    this._onSetProjectDescription = this._onSetProjectDescription.bind(this);
    this._onSaveProject = this._onSaveProject.bind(this);
    this._onDeleteProject = this._onDeleteProject.bind(this);
    this._onConfirmedProjectDeletion = this._onConfirmedProjectDeletion.bind(this);
    this._onCloseDialogProjectDeletion = this._onCloseDialogProjectDeletion.bind(this);
    this.state = {
      projectName: '',
      projectDescription: '',
      confirmDeleteDialogOpened: false
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
      owner: this.props.project.currentProject.owner,
      magpieId: this.props.project.currentProject.magpieId,
      name: this.state.projectName,
      description: this.state.projectDescription,
    });
  }

  _onDeleteProject(){
    this.setState({
      confirmDeleteDialogOpened: true
    });
  }

  _onConfirmedProjectDeletion(project){
    this._onCloseDialogProjectDeletion();
    this.props.projectActions.setCurrentProject({});
    this.props.projectAPIActions.deleteProject({id: this.props.project.currentProject.id})
  }

  _onCloseDialogProjectDeletion() {
    this.setState({
      confirmDeleteDialogOpened: false
    });
  }

  render () {
    return (
      <div className={classes['ProjectEditor']}>
        <Paper style={{marginTop: 20}}>
          <div className="container">
            <TextField
              id="cy-project-name-tf"
              data-cy-project-id={this.props.project.currentProject.id}
              placeholder="Define a name"
              value={this.state.projectName}
              fullWidth
              onChange={(event) => this._onSetProjectName(event.target.value)}
              label="Project name" />
            <TextField
              id="cy-project-description-tf"
              placeholder="Write a project description"
              value={this.state.projectDescription}
              fullWidth
              multiLine={true}
              rows={1}
              rowsMax={7}
              onChange={(event) => this._onSetProjectDescription(event.target.value)}
              label="Project description" />
            <Typography variant="subheading">Project permissions: </Typography>
            <div style={{width: '100%'}}>
              {
                this.props.project.currentProject.permissions.map((permission, i) =>
                  <FormControlLabel
                    label={permission.toUpperCase()}
                    control={
                      <Checkbox
                        className="cy-project-permission-cb"
                        disabled
                        checked={true} />
                    }>
                  </FormControlLabel>
                )
              }
            </div>
            <Button variant="contained"
                    id="cy-save-project-btn"
                    color="primary"
                    onClick={() => this._onSaveProject()}
                    disabled={!this.state.projectName || !this.state.projectName.length}>
              <SaveIcon />Save project properties
            </Button>
            <Button variant="contained"
                    id="cy-delete-project-btn"
                    onClick={() => this._onDeleteProject()}
                    color="secondary"
                    disabled={!this.state.projectName || !this.state.projectName.length}
                    style={{marginLeft: '20px'}}>
              <DeleteIcon />Delete project
            </Button>
          </div>
        </Paper>
        <ConfirmDialog
          isOpen={this.state.confirmDeleteDialogOpened}
          affectedResource={this.props.project.currentProject}
          onDialogConfirmed={this._onConfirmedProjectDeletion}
          onCloseDialog={this._onCloseDialogProjectDeletion}
          dialogContent={`Do you really want to delete the project ${this.state.projectName} and all its content?`}>
        </ConfirmDialog>
      </div>
    )
  }
}

export default ProjectEditor
