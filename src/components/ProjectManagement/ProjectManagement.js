import React from 'react';
import PropTypes from 'prop-types';
import classes from './ProjectManagement.scss';
import AppBar from '@material-ui/core/AppBar';
import ProjectShare from './../../components/ProjectShare';
import ProjectCreation from './../../components/ProjectCreation';
import ProjectDatasets from './../../components/ProjectDatasets';
import ProjectSearchCriterias from './../../components/ProjectSearchCriterias';
import ProjectSelector from './../../components/ProjectSelector';
import ProjectEditor from './../../components/ProjectEditor';
import Tab from'@material-ui/core/Tab';
import Tabs from'@material-ui/core/Tabs';

const CURRENT_PROJECT_TAB_VALUE = "CURRENT_PROJECT_TAB_VALUE";
const CREATE_PROJECT_TAB_VALUE = "CREATE_PROJECT_TAB_VALUE";
const SHARE_PROJECT_TAB_VALUE = "SHARE_PROJECT_TAB_VALUE";

export class ProjectManagement extends React.Component {
  state = {
    activeTab: CURRENT_PROJECT_TAB_VALUE
  };

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
  }

  render () {
   return (
     <div>
       <AppBar position="static" color="default">
         <Tabs
           centered
           fullWidth
           className={classes['ProjectManagement']}
           indicatorColor="primary"
           textColor="primary"
           onChange={(event, value) => this.setState({ activeTab: value })}
           value={this.state.activeTab}>
           <Tab id="cy-current-project-tab" value={CURRENT_PROJECT_TAB_VALUE} label="Current project" />
           <Tab id="cy-create-project-tab" value={CREATE_PROJECT_TAB_VALUE} label="Create new project" />
           <Tab id="cy-share-project-tab" value={SHARE_PROJECT_TAB_VALUE} label="Share project" />
         </Tabs>
       </AppBar>
       {
         this.state.activeTab === CURRENT_PROJECT_TAB_VALUE &&
         <div style={{margin: 20}}>
           <ProjectSelector {...this.props}/>
           {
             this.props.project.currentProject.id &&
             <div>
               <ProjectEditor {...this.props}/>
               <ProjectDatasets {...this.props} />
               <ProjectSearchCriterias {...this.props} />

             </div>
           }
         </div>
       }
       {
         this.state.activeTab === CREATE_PROJECT_TAB_VALUE &&
         <div style={{ margin: 20 }}>
           <ProjectCreation  {...this.props}/>
         </div>
       }
       {
         this.state.activeTab === SHARE_PROJECT_TAB_VALUE &&
         <div style={{ margin: 20 }}>
           <ProjectSelector {...this.props}/>
           <ProjectShare {...this.props}/>
         </div>
       }
     </div>
    );
  }
}

export default ProjectManagement
