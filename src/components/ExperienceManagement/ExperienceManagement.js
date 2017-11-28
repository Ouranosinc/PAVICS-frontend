import React from 'react';
import classes from './ExperienceManagement.scss';
import ProjectCreation from './../../components/ProjectCreation';
import ProjectDatasets from './../../components/ProjectDatasets';
import ProjectSearchCriterias from './../../components/ProjectSearchCriterias';
import ProjectSelector from './../../components/ProjectSelector';
import ProjectEditor from './../../components/ProjectEditor';
import { Tabs, Tab } from 'material-ui/Tabs';

const CURRENT_PROJECT_TAB_VALUE = "CURRENT_PROJECT_TAB_VALUE";
const CREATE_PROJECT_TAB_VALUE = "CREATE_PROJECT_TAB_VALUE";

export class ExperienceManagement extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    projectActions: React.PropTypes.object.isRequired,
    projectAPI: React.PropTypes.object.isRequired,
    projectAPIActions: React.PropTypes.object.isRequired,
    researchActions: React.PropTypes.object.isRequired,
    currentProjectDatasets: React.PropTypes.array.isRequired,
    currentProjectSearchCriterias: React.PropTypes.array.isRequired,
    currentVisualizedDatasets: React.PropTypes.array.isRequired,
    addDatasetsToVisualize: React.PropTypes.func.isRequired,
    removeSearchCriteriasFromProject: React.PropTypes.func.isRequired,
    selectCurrentDisplayedDataset: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired
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
     onChange={(value) => this.handleTabChange(value)}
     value={this.state.activeTab}>
     <Tab value={CURRENT_PROJECT_TAB_VALUE} label="Current project">
       {
         (this.state.activeTab === CURRENT_PROJECT_TAB_VALUE) ?
         <div className={classes['ExperienceManagement']} style={{ margin: 20 }}>
           <ProjectSelector {...this.props}/>
           <ProjectEditor {...this.props}/>
           {
             (this.props.project.currentProject.id) ?
               <div>
                 <ProjectDatasets {...this.props} />
                 <ProjectSearchCriterias {...this.props} />
               </div>: null
           }
         </div>: null
       }
     </Tab>
     <Tab value={CREATE_PROJECT_TAB_VALUE} label="Create new project">
       {
         (this.state.activeTab === CREATE_PROJECT_TAB_VALUE) ?
           <div className={classes['ExperienceManagement']} style={{ margin: 20 }}>
             <ProjectCreation  {...this.props}/>
           </div>: null
       }
     </Tab>
   </Tabs>
    );
  }
}

export default ExperienceManagement
