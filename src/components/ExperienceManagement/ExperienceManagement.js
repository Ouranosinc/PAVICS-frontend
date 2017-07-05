import React from 'react';
import classes from './ExperienceManagement.scss';
import ProjectDatasets from './../../components/ProjectDatasets';
import ProjectSearchCriterias from './../../components/ProjectSearchCriterias';
import ProjectSelector from './../../components/ProjectSelector';

export class ExperienceManagement extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    projectActions: React.PropTypes.object.isRequired,
    projectAPI: React.PropTypes.object.isRequired,
    projectAPIActions: React.PropTypes.object.isRequired,
    researchActions: React.PropTypes.object.isRequired,
    currentProjectDatasets: React.PropTypes.array.isRequired,
    currentProjectSearchCriterias: React.PropTypes.array.isRequired,
    currentVisualizedDatasetLayers: React.PropTypes.array.isRequired,
    addDatasetLayersToVisualize: React.PropTypes.func.isRequired,
    removeSearchCriteriasFromProject: React.PropTypes.func.isRequired,
    selectDatasetLayer: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired
  };
  constructor (props) {
    super(props);
  }

  render () {
   return (
      <div className={classes['ExperienceManagement']} style={{ margin: 20 }}>
        <ProjectSelector {...this.props}/>
        {
          (this.props.project.currentProject.id) ?
            <div>
              <ProjectDatasets {...this.props} />
              <ProjectSearchCriterias {...this.props} />
            </div>: null
        }
      </div>
    );
  }
}

export default ExperienceManagement
