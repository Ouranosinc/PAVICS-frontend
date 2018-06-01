import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as pavicsActions from './../modules/Pavics';
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
    addDatasetsToVisualize: React.PropTypes.func.isRequired,
    // chooseStep: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    platform: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    const authCookie = cookie.load(constants.AUTH_COOKIE);
    console.log(authCookie);
    if (authCookie) {
      console.log('checking login');
      this.props.checkLogin();
    } else {

    }
  }

  componentWillMount () {
    this.startErrorLog();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.sessionManagement.sessionStatus &&
        this.props.sessionManagement.sessionStatus !== nextProps.sessionManagement.sessionStatus &&
        nextProps.sessionManagement.sessionStatus.user && nextProps.sessionManagement.sessionStatus.user.username.length) {
      let filter = JSON.stringify({"where": { "user": nextProps.sessionManagement.sessionStatus.user.username},"order": "name ASC"});
      this.props.fetchProjects({filter: filter });
      this.props.fetchPavicsDatasetsAndFacets('Aggregate', 0);
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
            currentTitle={this.makeTitle()}/>
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
    sessionManagement: state.sessionManagement
  };
};
const mapActionCreators = {
  ...pavicsActions,
  checkLogin: sessionActions.checkLogin,
  fetchPavicsDatasetsAndFacets: researchActions.fetchPavicsDatasetsAndFacets,
  fetchProjects: projectAPIActions.fetchProjects,
};

export default connect(mapStateToProps, mapActionCreators)(Pavics);
