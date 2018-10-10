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
    sectionActions: PropTypes.object.isRequired,
    datasetAPI: PropTypes.object.isRequired,
    datasetAPIActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    projectAPI: PropTypes.object.isRequired,
    projectActions: PropTypes.object.isRequired,
    projectAPIActions: PropTypes.object.isRequired,
    research: PropTypes.object.isRequired,
    researchAPI: PropTypes.object.isRequired,
    researchActions: PropTypes.object.isRequired,
    researchAPIActions: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    layerDataset: PropTypes.object.isRequired,
    layerDatasetActions: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
  }

  render () {
   return (
     <React.Fragment>
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
           <ProjectSelector
              project={this.props.project}
              projectActions={this.props.projectActions}
              projectAPI={this.props.projectAPI} />
           {
             this.props.project.currentProject.id &&
             <React.Fragment>
               <ProjectEditor
                 project={this.props.project}
                 projectActions={this.props.projectActions}
                 projectAPI={this.props.projectAPI}
                 projectAPIActions={this.props.projectAPIActions} />
               <ProjectDatasets
                 project={this.props.project}
                 projectActions={this.props.projectActions}
                 datasetAPI={this.props.datasetAPI}
                 datasetAPIActions={this.props.datasetAPIActions}
                 layerDataset={this.props.layerDataset}
                 layerDatasetActions={this.props.layerDatasetActions}/>
               <ProjectSearchCriterias
                 sectionActions={this.props.sectionActions}
                 project={this.props.project}
                 researchActions={this.props.researchActions}
                 researchAPI={this.props.researchAPI}
                 researchAPIActions={this.props.researchAPIActions} />
             </React.Fragment>
           }
         </div>
       }
       {
         this.state.activeTab === CREATE_PROJECT_TAB_VALUE &&
         <div style={{ margin: 20 }}>
           <ProjectCreation
             session={this.props.session}
             project={this.props.project}
             projectActions={this.props.projectActions}
             projectAPI={this.props.projectAPI}
             projectAPIActions={this.props.projectAPIActions} />
         </div>
       }
       {
         this.state.activeTab === SHARE_PROJECT_TAB_VALUE &&
         <div style={{ margin: 20 }}>
           <ProjectSelector
             project={this.props.project}
             projectActions={this.props.projectActions}
             projectAPI={this.props.projectAPI} />
           <ProjectShare
             project={this.props.project}
             projectAPIActions={this.props.projectAPIActions}
             session={this.props.session} />
         </div>
       }
     </React.Fragment>
    );
  }
}

export default ProjectManagement
