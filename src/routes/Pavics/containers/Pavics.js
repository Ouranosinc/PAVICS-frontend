import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import * as pavicsActions from './../modules/Pavics';
import { actions as projectActions } from '../../../redux/modules/Project';
import { actions as projectAPIActions } from '../../../redux/modules/ProjectAPI';
import { actions as researchActions } from '../../../redux/modules/Research';
import { actions as sessionActions } from '../../../redux/modules/SessionManagement';

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
require('react-notifications/lib/notifications.css');
import { NotificationContainer, NotificationManager } from 'react-notifications';

class Pavics extends React.Component {
  static propTypes = {
    addDatasetsToVisualize: PropTypes.func.isRequired,
    // chooseStep: PropTypes.func.isRequired,
    goToSection: PropTypes.func.isRequired,
    platform: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    const authCookie = cookie.load(constants.AUTH_COOKIE);
    this.shouldSetDefaultProject = false; // Do not autoset until user is logged in
    // console.log(authCookie);
    if (authCookie) {
      console.log('checking login');
      this.props.checkLogin();
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
    if (nextProps.sessionManagement.sessionStatus &&
        this.props.sessionManagement.sessionStatus !== nextProps.sessionManagement.sessionStatus &&
        nextProps.sessionManagement.sessionStatus.user && nextProps.sessionManagement.sessionStatus.user.username.length) {
      // After user logged in fetch user projects and catalogs facets
      this.triggerOnLoginActions();
    }else if( nextProps.sessionManagement.sessionStatus &&
      this.props.sessionManagement.sessionStatus !== nextProps.sessionManagement.sessionStatus &&
      this.props.sessionManagement.sessionStatus.user.authenticated === true &&
      nextProps.sessionManagement.sessionStatus.user.authenticated === false) {
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
    this.props.fetchByMagpieAccessProjects();
    this.props.fetchPavicsDatasetsAndFacets('Aggregate', 0);
  }

  triggerOnLogoutActions() {
    this.props.resetVisualizeState();
    // TODO: Could reset all redux store modules, but following two functions are fine for now
    this.props.fetchByMagpieAccessProjects();
    this.props.setCurrentProject({});
  }

  triggerOnProjectsFetchedActions(props) {
    if (this.shouldSetDefaultProject) {
      // Do only once per login action, if it already occurred, ignore all futures project fetches
      if (props.projectAPI.items.length) {
        // If there's more than one project returned, select automatically the first one returned
        const project = props.projectAPI.items[0];
        this.props.setCurrentProject(project);
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
      this.props.setCurrentProject(project);
      NotificationManager.info(`Project '${project.name}' has been selected as the current project.`, 'Information', 10000);
    }
  }

  startErrorLog () {
    // Prototype that should catch and display every app errors (HTTP and other promises errors aren't catched properly tho)
    window.onerror = (message,file,line,column,errorObject) => {
      column = column || (window.event && window.event.errorCharacter);
      var stack = errorObject ? errorObject.stack : null;

      //trying to get stack from IE
      if(!stack)
      {
        var stack = [];
        var f = arguments.callee.caller;
        while (f)
        {
          stack.push(f.name);
          f = f.caller;
        }
        errorObject['stack'] = stack;
      }
      NotificationManager.error(message, 'Error', 10000);
      // var data = {
      //   message:message,
      //   file:file,
      //   line:line,
      //   column:column,
      //   errorStack:stack,
      // };
      return false;
    }
  }

  makeSection () {
    switch (this.props.platform.section) {
      case constants.PLATFORM_SECTION_SEARCH_DATASETS:
        return (
          <ResearchContainer {...this.props} />
        );
      case constants.PLATFORM_SECTION_PROJECT_MANAGEMENT:
        return (
          <ProjectManagementContainer {...this.props} />
        );
      case constants.PLATFORM_SECTION_WORKFLOWS:
        return (
          <WorkflowWizardContainer {...this.props} />
        );
      case constants.PLATFORM_SECTION_MONITOR:
        return (
          <ProcessMonitoringContainer {...this.props} />
        );
      case constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT:
        return (
          <AccountManagementContainer {...this.props} />
        );
      default:
        return null;
    }
  }

  makeTitle () {
    switch (this.props.platform.section) {
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
      <MuiThemeProvider>
        <div>
          <VisualizeContainer {...this.props} />
          <SectionalPanel
            section={this.props.platform.section}
            goToSection={this.props.goToSection}
            showContent={this.makeSection() !== null}
            currentContent={this.makeSection()}
            currentTitle={this.makeTitle()}
            project={this.props.project}
            sessionManagement={this.props.sessionManagement} />
          <NotificationContainer />
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.pavics.visualize,
    platform: state.pavics.platform,
    project: state.project,
    projectAPI: state.projectAPI,
    sessionManagement: state.sessionManagement
  };
};
/*
 *
 * Minimal set of functions directly on this.props object needed for top-level actions container
 * TODO: move pavicsActions into visualize reducer
 * TODO: then, remove pavicsActions, each container is in charge of setting his reducers himself
 */
const mapActionCreators = {
  ...pavicsActions,
  checkLogin: sessionActions.checkLogin,
  fetchPavicsDatasetsAndFacets: researchActions.fetchPavicsDatasetsAndFacets,
  fetchByMagpieAccessProjects: projectAPIActions.fetchByMagpieAccessProjects,
  setCurrentProject: projectActions.setCurrentProject
};

export default connect(mapStateToProps, mapActionCreators)(Pavics);
