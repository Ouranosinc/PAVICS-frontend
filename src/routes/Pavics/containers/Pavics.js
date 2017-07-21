import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as actionCreators from './../modules/Pavics';
import * as workflowActionCreators from './../../../redux/modules/Workflow';
import { actions as researchActionsCreators } from '../../../redux/modules/ResearchAPI';
import * as constants from './../../../constants';
import {
  AccountManagementContainer,
  ExperienceManagementContainer,
  ResearchContainer,
  ProcessMonitoringContainer,
  VisualizeContainer,
  WorkflowWizardContainer } from './../../../containers';
import { SectionalPanel } from './../../../components/SectionalPanel';
require('react-notifications/lib/notifications.css');
import { NotificationContainer, NotificationManager } from 'react-notifications';

class Pavics extends React.Component {
  static propTypes = {
    addDatasetLayersToVisualize: React.PropTypes.func.isRequired,
    // chooseStep: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    platform: React.PropTypes.object.isRequired,
    fetchVisualizableData: React.PropTypes.func.isRequired
  };

  componentWillMount () {
    this.startErrorLog();
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
          <ExperienceManagementContainer {...this.props} />
        );
      case constants.PLATFORM_SECTION_WORKFLOWS:
        return (
          <WorkflowWizardContainer {...this.props} />
        );
      case constants.PLATFORM_SECTION_MONITOR:
        return (
          <ProcessMonitoringContainer
            addDatasetLayersToVisualize={this.props.addDatasetLayersToVisualize}
            workflow={this.props.workflow}
            workflowActions={this.props.workflowActions}
            fetchVisualizableData={this.props.fetchVisualizableData} />
        );
      case constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT:
        return (
          <AccountManagementContainer {...this.props} />
        );
      default:
        return null;
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
            // chooseStep={this.props.workflowActions.chooseStep}
            showContent={this.makeSection() !== null}
            currentContent={this.makeSection()} />
          <NotificationContainer />
        </div>
      </MuiThemeProvider>
    );
  }
}

// const mapActionCreators = dispatch => ({
//   researchActions: bindActionCreators({...researchActionsCreators}, dispatch)
// });

const mapActionCreators = {
  ...actionCreators,
  ...workflowActionCreators
};
const mapStateToProps = state => {
  return {
    ...state.pavics.visualize,
    platform: state.pavics.platform
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
