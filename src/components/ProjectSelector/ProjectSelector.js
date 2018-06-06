import React from 'react'
import classes from './ProjectSelector.scss';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import { NotificationManager } from 'react-notifications';

export class ProjectSelector extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    this._onSetCurrentProject = this._onSetCurrentProject.bind(this);
  }

  componentWillMount() {
    // Commented since it will trigger another warning if no project returned
    // this.props.projectAPIActions.fetchByMagpieAccessProjects();
  }

  _onSetCurrentProject(id){
    let project = this.props.projectAPI.items.find(x => x.id === id);
    this.props.projectActions.setCurrentProject(project);
    NotificationManager.info(`Project '${project.name}' has been selected as the current project.`, 'Information', 10000);
    // TODO RESET DATASET SELECTION IN LAYER SWITCHER
    // TODO RESET LAYER SWITCH DATASETS LIST
  }

  render () {
    return (
      <div className={classes['ProjectSelector']}>
        <Paper style={{marginTop: 20}}>
          <div className="container">
            <SelectField
              id="cy-project-selector"
              fullWidth={true}
              floatingLabelText="Current project"
              value={this.props.project.currentProject.id}
              onChange={(event, index, value) => this._onSetCurrentProject(value)}>
              {
                this.props.projectAPI.items.map((project, i) => {
                  return <MenuItem data-cy-item-project-id={project.id} key={i} value={project.id} primaryText={project.name} />;
                })
              }
            </SelectField>
          </div>
        </Paper>
      </div>
    )
  }
}

export default ProjectSelector
