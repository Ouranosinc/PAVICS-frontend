import React from 'react';
import PropTypes from 'prop-types';
import classes from './ProjectSelector.scss';
import MenuItem from'@material-ui/core/MenuItem';
import Paper from'@material-ui/core/Paper';
import Select from'@material-ui/core/Select';
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
            <Select
              id="cy-project-selector"
              fullWidth={true}
              label="Current project"
              value={this.props.project.currentProject.id}
              onChange={(event, index, value) => this._onSetCurrentProject(value)}>
              {
                this.props.projectAPI.items.map((project, i) => {
                  return <MenuItem data-cy-item-project-id={project.id} key={i} value={project.id} primaryText={project.name} />;
                })
              }
            </Select>
          </div>
        </Paper>
      </div>
    )
  }
}

export default ProjectSelector
