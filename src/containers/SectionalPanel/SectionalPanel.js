import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as constants from './../../constants';
import {
  AccountManagementContainer,
  ProjectManagementContainer,
  ResearchContainer,
  ProcessMonitoringContainer,
  WorkflowWizardContainer } from './../../containers';
import { actions as sectionActions } from '../../redux/modules/Section';
import SectionalPanel from './../../components/SectionalPanel';

export class SectionalPanelContainer extends React.Component {
  static propTypes = {
    sectionActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    section: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
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
      <SectionalPanel
        section={this.props.section}
        sectionActions={this.props.sectionActions}
        showContent={this.makeSection() !== null}
        currentContent={this.makeSection()}
        currentTitle={this.makeTitle()}
        project={this.props.project}
        session={this.props.session} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    project: state.project,
    section: state.section,
    session: state.session,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    sectionActions: bindActionCreators({...sectionActions}, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionalPanelContainer)
