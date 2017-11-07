import React from 'react'
import classes from './ProjectSelector.scss';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';

export class ProjectSelector extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    this._onSetCurrentProject = this._onSetCurrentProject.bind(this);
  }

  componentWillMount() {
    let filter = JSON.stringify({"where": { "researcherId": 1},"order": "name ASC"});
    this.props.projectAPIActions.fetchProjects({filter: filter });
  }

  _onSetCurrentProject(id){
    let project = this.props.projectAPI.items.find(x => x.id === id);
    this.props.projectActions.setCurrentProject(project);
    // TODO RESET DATASET SELECTION IN LAYER SWITCHER
    // TODO RESET LAYER SWITCH DATASETS LIST
  }

  render () {
    return (
      <div className={classes['ProjectSelector']}>
        <Paper style={{marginTop: 20}}>
          <div className="container">
            <SelectField
              fullWidth={true}
              floatingLabelText="Current project"
              value={this.props.project.currentProject.id}
              onChange={(event, index, value) => this._onSetCurrentProject(value)}>
              {
                this.props.projectAPI.items.map((project, i) => {
                  return <MenuItem key={i} value={project.id} primaryText={project.name} />;
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
