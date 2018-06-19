import React from 'react';
import PropTypes from 'prop-types';
import classes from './ProjectSelector.scss';
import MenuItem from'@material-ui/core/MenuItem';
import Paper from'@material-ui/core/Paper';
import Select from'@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
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
          <form className="container">
            <FormControl fullWidth>
              <InputLabel htmlFor="current-project">Current project</InputLabel>
              <Select
                id="cy-project-selector"
                inputProps={{
                  name: 'current-project',
                  id: 'current-project',
                }}
                value={this.props.project.currentProject.id}
                onChange={(event) => this._onSetCurrentProject(event.target.value)}>
                {
                  this.props.projectAPI.items.map((project, i) =>
                    <MenuItem data-cy-item-project-id={project.id} key={i} value={project.id}>
                      {project.name}
                    </MenuItem>
                  )
                }
              </Select>
            </FormControl>
          </form>
        </Paper>
      </div>
    )
  }
}

export default ProjectSelector
