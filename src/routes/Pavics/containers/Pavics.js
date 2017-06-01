import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as actionCreators from './../modules/Pavics';
import * as projectActionCreators from './../../../redux/modules/Project';
import { actions as researchActionsCreators } from '../../../redux/modules/ResearchAPI';
import * as constants from './../../../constants';
import {
  AccountManagementContainer,
  ExperienceManagementContainer,
  ResearchContainer,
  WorkflowWizardContainer,
  ProcessMonitoringContainer,
  VisualizeContainer } from './../../../containers';
import { SectionalPanel } from './../../../components/SectionalPanel';

class Pavics extends React.Component {
  static propTypes = {
    addDatasetLayersToVisualize: React.PropTypes.func.isRequired,
    chooseStep: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    platform: React.PropTypes.object.isRequired,
    fetchWPSJobs: React.PropTypes.func.isRequired,
    monitor: React.PropTypes.object.isRequired,
    fetchVisualizableData: React.PropTypes.func.isRequired
  };

  makeSection () {
    switch (this.props.platform.section) {
      case constants.PLATFORM_SECTION_SEARCH_DATASETS:
        return (
          <ResearchContainer {...this.props} />
        );
      case constants.PLATFORM_SECTION_EXPERIENCE_MANAGEMENT:
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
            fetchWPSJobs={this.props.fetchWPSJobs}
            monitor={this.props.monitor}
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
            chooseStep={this.props.chooseStep}
            showContent={this.makeSection() !== null}
            currentContent={this.makeSection()} />
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
  ...projectActionCreators
};
const mapStateToProps = state => {
  return {
    ...state.pavics.workflowWizard,
    ...state.pavics.visualize,
    platform: state.pavics.platform,
    monitor: state.pavics.monitor,
    project: state.project,
    research: state.research
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
