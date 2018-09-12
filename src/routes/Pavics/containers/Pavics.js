import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { actions as projectActions } from '../../../redux/modules/Project';
import { actions as projectAPIActions } from '../../../redux/modules/ProjectAPI';
import { actions as researchActions } from '../../../redux/modules/Research';
import { actions as sectionActions } from '../../../redux/modules/Section';
import { actions as sessionActions } from '../../../redux/modules/Session';
import { actions as visualizeActions } from '../../../redux/modules/Visualize';
import cookie from 'react-cookies';
import * as constants from './../../../constants';
import {
  AccountManagementContainer,
  ProjectManagementContainer,
  ResearchContainer,
  ProcessMonitoringContainer,
  VisualizeContainer,
  WorkflowWizardContainer } from './../../../containers';
import { SectionalPanel } from './../../../components/SectionalPanel';
import { NotificationContainer, NotificationManager } from 'react-notifications';
require('react-notifications/lib/notifications.css');

const theme = createMuiTheme({
  overrides: {
    MuiFormControl: {
      root: {
        margin: '5px 0'
      }
    },
    MuiGrid: {
      item: {
        padding: '0 5px'
      }
    },
    MuiSvgIcon: {
      root: {
        marginRight: '2px'
      }
    },
    MuiButton: {
      root: {
        margin: '15px 0 0 0'
      }
    },
    MuiStepper: {
      root: {
        backgroundColor: 'transparent'
      }
    }
  },
  typography: {
    /*fontSize: '18'*/
  }
});

class Pavics extends React.Component {
  static propTypes = {
    projectActions: PropTypes.object.isRequired,
    projectAPIActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    projectAPI: PropTypes.object.isRequired,
    researchActions: PropTypes.object.isRequired,
    section: PropTypes.object.isRequired,
    sectionActions: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    sessionActions: PropTypes.object.isRequired,
    visualize: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    const authCookie = cookie.load(constants.AUTH_COOKIE);
    this.shouldSetDefaultProject = false; // Do not autoset until user is logged in
    // console.log(authCookie);
    if (authCookie) {
      console.log('checking login');
      this.props.sessionActions.checkLogin();
    } else {

    }
  }

  componentWillMount () {
    this.startErrorLog();
  }

  /*
   Top level container Pavics is in charge of global actions triggers
   Triggers:
     - After login: fetch projects and catalog facets
     - TODO: After logout: reset initialState
     - After projects fetched: set automatically current project (first returned)
     - TODO: After project creation: set automatically current project (project created)
   */
  componentWillReceiveProps (nextProps) {
    if (nextProps.session.sessionStatus &&
        this.props.session.sessionStatus !== nextProps.session.sessionStatus && nextProps.session.sessionStatus.user &&
        nextProps.session.sessionStatus.user.username && nextProps.session.sessionStatus.user.username.length) {
      // After user logged in fetch user projects and catalogs facets
      this.triggerOnLoginActions();
    }else if( nextProps.session.sessionStatus &&
      this.props.session.sessionStatus !== nextProps.session.sessionStatus &&
      this.props.session.sessionStatus.user.authenticated === true &&
      nextProps.session.sessionStatus.user.authenticated === false) {
      this.triggerOnLogoutActions();
    }

    // If projects were fetched try to automatically select the first one returned
    // Note, Do only once per login action
    if(nextProps.projectAPI && this.props.projectAPI.isFetching === true && nextProps.projectAPI.isFetching === false) {
      this.triggerOnProjectsFetchedActions(nextProps);
    }

    // After a project was sucessfully created, select it as current project
    if(nextProps.projectAPI && this.props.projectAPI.isCreating === true && nextProps.projectAPI.isCreating === false) {
      this.triggerOnProjectCreatedActions(nextProps);
    }
  }

  triggerOnLoginActions() {
    this.shouldSetDefaultProject = true; // Default project can now be automatically selected
    this.props.projectAPIActions.fetchByMagpieAccessProjects();
    this.props.researchActions.fetchPavicsDatasetsAndFacets('Aggregate', 0);
  }

  triggerOnLogoutActions() {
    this.props.visualizeActions.resetVisualizeState();
    // TODO: Could reset all redux store modules, but following two functions are fine for now
    this.props.projectAPIActions.fetchByMagpieAccessProjects();
    this.props.projectActions.setCurrentProject({});
  }

  triggerOnProjectsFetchedActions(props) {
    if (this.shouldSetDefaultProject) {
      // Do only once per login action, if it already occurred, ignore all futures project fetches
      if (props.projectAPI.items.length) {
        // If there's more than one project returned, select automatically the first one returned
        const project = props.projectAPI.items[0];
        this.props.projectActions.setCurrentProject(project);
        NotificationManager.info(`Project '${project.name}' has been selected as the default project.`, 'Information', 10000);
        this.shouldSetDefaultProject = false; // Deactivate default project auto selection until next login action
      } else {
        // If user has no access to any project, warn him that he needs to create a new project ASAP
        NotificationManager.warning(`You do not have access to any project at the moment. 
        Please create your own new project before going any further.`, 'Information', 10000);
      }
    }
  }

  triggerOnProjectCreatedActions(props) {
    if (props.projectAPI.items.length) {
      let project = props.projectAPI.items[props.projectAPI.items.length - 1];
      // FIXME, project-api should return project containing permissions, always
      project.permissions = ["read", "write"];
      this.props.projectActions.setCurrentProject(project);
      NotificationManager.info(`Project '${project.name}' has been selected as the current project.`, 'Information', 10000);
    }
  }

  // Prototype that should catch and display every app errors (HTTP and other promises errors aren't catched properly tho)
  startErrorLog () {
    window.onerror = (message, file, line, column, errorObject) => {
      let stack = errorObject ? errorObject.stack : null;

      // Trying to get stack from IE
      if(!stack) {
        stack = [];
        let f = arguments.callee.caller;
        while (f) {
          stack.push(f.name);
          f = f.caller;
        }
        errorObject['stack'] = stack;
      }
      // Commented because of Cesium viewState() Error on 2018-08-24
      // FIXME: NotificationManager.error(message, 'Error', 10000);
      return false;
    }
  }

  makeSection () {
    switch (this.props.section.openedSection) {
      case constants.PLATFORM_SECTION_SEARCH_DATASETS:
        return (
          <ResearchContainer />
        );
      case constants.PLATFORM_SECTION_PROJECT_MANAGEMENT:
        return (
          <ProjectManagementContainer />
        );
      case constants.PLATFORM_SECTION_WORKFLOWS:
        return (
          <WorkflowWizardContainer />
        );
      case constants.PLATFORM_SECTION_MONITOR:
        return (
          <ProcessMonitoringContainer />
        );
      case constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT:
        return (
          <AccountManagementContainer />
        );
      default:
        return null;
    }
  }

  makeTitle () {
    switch (this.props.section.openedSection) {
      case constants.PLATFORM_SECTION_SEARCH_DATASETS:
        return "Search Datasets";
      case constants.PLATFORM_SECTION_PROJECT_MANAGEMENT:
        return "Project Management";
      case constants.PLATFORM_SECTION_WORKFLOWS:
        return "Data Processing";
      case constants.PLATFORM_SECTION_MONITOR:
        return "Processes Monitoring";
      case constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT:
        return "Account Management";
      default:
        return "";
    }
  }

  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <React.Fragment>
          <VisualizeContainer {...this.props} />
          {/* TODO: SectionalPanel SHOULD BE A CONTAINER AS WELL WITH ITS OWN CONNECT... */}
          <SectionalPanel
            section={this.props.section}
            sectionActions={this.props.sectionActions}
            showContent={this.makeSection() !== null}
            currentContent={this.makeSection()}
            currentTitle={this.makeTitle()}
            project={this.props.project}
            session={this.props.session} />
          <NotificationContainer />
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    project: state.project,
    projectAPI: state.projectAPI,
    section: state.section ,
    session: state.session,
    visualize: state.visualize
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sectionActions: bindActionCreators({...sectionActions}, dispatch),
    sessionActions: bindActionCreators({...sessionActions}, dispatch),
    researchActions: bindActionCreators({...researchActions}, dispatch),
    projectAPIActions: bindActionCreators({...projectAPIActions}, dispatch),
    projectActions: bindActionCreators({...projectActions}, dispatch),
    visualizeActions: bindActionCreators({...visualizeActions}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pavics);
