import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as actionCreators from './../modules/Pavics';
import * as projectActionCreators from './../../../redux/modules/Project';
import { actions as researchActionsCreators } from './../../../redux/modules/Research';
import * as constants from './../../../constants';
import {
  AccountManagement,
  ExperienceManagement,
  SearchCatalog,
  Research,
  WorkflowWizard,
  ProcessMonitoring,
  Visualize } from './../../../containers';
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
          <div>
            <SearchCatalog {...this.props} />
          </div>
        );
      case constants.PLATFORM_SECTION_EXPERIENCE_MANAGEMENT:
        return (
          <ExperienceManagement {...this.props} />
        );
      case constants.PLATFORM_SECTION_WORKFLOWS:
        return (
          <WorkflowWizard {...this.props} />
        );
      case constants.PLATFORM_SECTION_MONITOR:
        return (
          <ProcessMonitoring
            addDatasetLayersToVisualize={this.props.addDatasetLayersToVisualize}
            fetchWPSJobs={this.props.fetchWPSJobs}
            monitor={this.props.monitor}
            fetchVisualizableData={this.props.fetchVisualizableData} />
        );
      case constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT:
        return (
          <AccountManagement {...this.props} />
        );
      default:
        return null;
    }
  }

  render () {
    return (
      <MuiThemeProvider>
        <div>
          <Visualize {...this.props} />
          <SectionalPanel
            section={this.props.platform.section}
            goToSection={this.props.goToSection}
            chooseStep={this.props.chooseStep}
            showContent={this.makeSection() !== null}
            currentContent={this.makeSection()} />
          <Research {...this.props}/>
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
    project: state.project
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
