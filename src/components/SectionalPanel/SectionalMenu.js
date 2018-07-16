import React from 'react';
import PropTypes from 'prop-types';
import classes from './SectionalPanel.scss';
import { NotificationManager } from 'react-notifications';
import * as constants from './../../constants';
import MonitoringIcon from '@material-ui/icons/FormatListBulleted';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import InputIcon from '@material-ui/icons/Input';
import SearchIcon from '@material-ui/icons/Search';

class SectionalMenu extends React.Component {
  static propTypes = {
    sectionActions: PropTypes.object.isRequired,
    section: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };
  search = () => {
    if (constants.PLATFORM_SECTION_SEARCH_DATASETS !== this.props.section.openedSection) {
      if(!this.isUserAuthenticated()){
        this.triggerAuthWarning(constants.PLATFORM_SECTION_SEARCH_DATASETS)
      }else if (!this.isCurrentProjectSelected()) {Fboot
        this.triggerCurrentProjectWarning(constants.PLATFORM_SECTION_SEARCH_DATASETS);
      }else {
        this.props.sectionActions.goToSection(constants.PLATFORM_SECTION_SEARCH_DATASETS);
      }
    } else {
      this.props.sectionActions.goToSection('');
    }
  };
  experience = () => {
    if (constants.PLATFORM_SECTION_PROJECT_MANAGEMENT !== this.props.section.openedSection) {
      if(!this.isUserAuthenticated()){
        this.triggerAuthWarning(constants.PLATFORM_SECTION_PROJECT_MANAGEMENT)
      } else {
        this.props.sectionActions.goToSection(constants.PLATFORM_SECTION_PROJECT_MANAGEMENT);
      }
    } else {
      this.props.sectionActions.goToSection('');
    }
  };
  monitor = () => {
    if (constants.PLATFORM_SECTION_MONITOR !== this.props.section.openedSection) {
      if(!this.isUserAuthenticated()){
        this.triggerAuthWarning(constants.PLATFORM_SECTION_MONITOR)
      }else if (!this.isCurrentProjectSelected()) {
        this.triggerCurrentProjectWarning(constants.PLATFORM_SECTION_MONITOR);
      }else {
        this.props.sectionActions.goToSection(constants.PLATFORM_SECTION_MONITOR);
      }
    } else {
      this.props.sectionActions.goToSection('');
    }
  };
  workflows = () => {
    if (constants.PLATFORM_SECTION_WORKFLOWS !== this.props.section.openedSection) {
      if(!this.isUserAuthenticated()){
        this.triggerAuthWarning(constants.PLATFORM_SECTION_WORKFLOWS)
      }else if (!this.isCurrentProjectSelected()) {
        this.triggerCurrentProjectWarning(constants.PLATFORM_SECTION_WORKFLOWS);
      }else {
        this.props.sectionActions.goToSection(constants.PLATFORM_SECTION_WORKFLOWS);
      }
    } else {
      this.props.sectionActions.goToSection('');
    }
  };
  account = () => {
    if (constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT !== this.props.section.openedSection) {
      this.props.sectionActions.goToSection(constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT);
    } else {
      this.props.sectionActions.goToSection('');
    }
  };

  isUserAuthenticated () {
    return this.props.session.sessionStatus &&
      this.props.session.sessionStatus.user &&
      this.props.session.sessionStatus.user.authenticated;
  };

  triggerAuthWarning (section) {
    NotificationManager.warning(`You need to be authenticated to use "${section}" features.`, 'Warning', 10000);
  };

  isCurrentProjectSelected () {
    return this.props.project.currentProject &&
      this.props.project.currentProject.id &&
      this.props.project.currentProject.id !== 0;
  };

  triggerCurrentProjectWarning (section) {
    NotificationManager.warning(`You need to have selected a current project to use "${section}" features.`, 'Warning', 10000);
  };

  render () {
    return (
      <div className={classes['SectionalMenu']}>
        <nav id="cy-sectional-menu">
          <a id="cy-search-datasets" onClick={this.search} title="Search Datasets"
            className={(this.props.section.openedSection === constants.PLATFORM_SECTION_SEARCH_DATASETS) ? classes['active'] : ''}>
            <SearchIcon />
          </a>
          <a id="cy-project-management" onClick={this.experience} title="Project Management"
            className={(this.props.section.openedSection === constants.PLATFORM_SECTION_PROJECT_MANAGEMENT) ? classes['active'] : ''}>
            <AssignmentIcon />
          </a>
          <a id="cy-data-processing"onClick={this.workflows} title="Data Processing"
            className={(this.props.section.openedSection === constants.PLATFORM_SECTION_WORKFLOWS) ? classes['active'] : ''}>
            <InputIcon />
          </a>
          <a id="cy-process-monitoring"onClick={this.monitor} title="Processes Monitoring"
            className={(this.props.section.openedSection === constants.PLATFORM_SECTION_MONITOR) ? classes['active'] : ''}>
            <MonitoringIcon />
          </a>
          <a id="cy-account-management" onClick={this.account} title="Account Management"
            className={(this.props.section.openedSection === constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT) ? classes['active'] : ''}>
            <AccountCircleIcon />
          </a>
        </nav>
      </div>
    );
  }
}
export default SectionalMenu;
