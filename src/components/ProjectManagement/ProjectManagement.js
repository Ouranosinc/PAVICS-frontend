import React from 'react';
import PropTypes from 'prop-types';
import classes from './ProjectManagement.scss';
import ProjectShare from './../../components/ProjectShare';
import ProjectCreation from './../../components/ProjectCreation';
import ProjectDatasets from './../../components/ProjectDatasets';
import ProjectSearchCriterias from './../../components/ProjectSearchCriterias';
import ProjectSelector from './../../components/ProjectSelector';
import ProjectEditor from './../../components/ProjectEditor';
import { Tabs, Tab } from'@material-ui/core/Tabs';

const CURRENT_PROJECT_TAB_VALUE = "CURRENT_PROJECT_TAB_VALUE";
const CREATE_PROJECT_TAB_VALUE = "CREATE_PROJECT_TAB_VALUE";
const SHARE_PROJECT_TAB_VALUE = "SHARE_PROJECT_TAB_VALUE";

export class ProjectManagement extends React.Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    projectActions: PropTypes.object.isRequired,
    projectAPI: PropTypes.object.isRequired,
    projectAPIActions: PropTypes.object.isRequired,
    researchActions: PropTypes.object.isRequired,
    currentProjectDatasets: PropTypes.array.isRequired,
    currentProjectSearchCriterias: PropTypes.array.isRequired,
    currentVisualizedDatasets: PropTypes.array.isRequired,
    addDatasetsToVisualize: PropTypes.func.isRequired,
    removeSearchCriteriasFromProject: PropTypes.func.isRequired,
    selectCurrentDisplayedDataset: PropTypes.func.isRequired,
    goToSection: PropTypes.func.isRequired,
    sessionManagement: PropTypes.object.isRequired,
  };
  constructor (props) {
    super(props);
    this.state = {
      activeTab: CURRENT_PROJECT_TAB_VALUE
    };
  }

  handleTabChange(value) {
    this.setState({
      activeTab: value
    })
  }

  render () {
   return (
   <Tabs
     className={classes['ProjectManagement']}
     onChange={(value) => this.handleTabChange(value)}
     value={this.state.activeTab}>
     <Tab id="cy-current-project-tab" value={CURRENT_PROJECT_TAB_VALUE} label="Current project">
       {
         (this.state.activeTab === CURRENT_PROJECT_TAB_VALUE) ?
         <div style={{ margin: 20 }}>
           <ProjectSelector {...this.props}/>
           {
             (this.props.project.currentProject.id) ?
               <div>
                 <ProjectEditor {...this.props}/>
                 <ProjectDatasets {...this.props} />
                 <ProjectSearchCriterias {...this.props} />
               </div>: null
           }
         </div>: null
       }
     </Tab>
     <Tab id="cy-create-project-tab" value={CREATE_PROJECT_TAB_VALUE} label="Create new project">
       {
         (this.state.activeTab === CREATE_PROJECT_TAB_VALUE) ?
           <div style={{ margin: 20 }}>
             <ProjectCreation  {...this.props}/>
           </div>: null
       }
     </Tab>
     <Tab id="cy-share-project-tab" value={SHARE_PROJECT_TAB_VALUE} label="Share project">
       {
         (this.state.activeTab === SHARE_PROJECT_TAB_VALUE) ?
           <div style={{ margin: 20 }}>
             <ProjectSelector {...this.props}/>
             <ProjectShare {...this.props}/>
           </div>: null
       }
     </Tab>
   </Tabs>
    );
  }
}

export default ProjectManagement
