import React from 'react';
import PropTypes from 'prop-types';
import classes from './SectionalPanel.scss';
import { NotificationManager } from 'react-notifications';
import { Glyphicon } from 'react-bootstrap';
import * as constants from './../../constants';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import InputIcon from '@material-ui/icons/Input';
import SearchIcon from '@material-ui/icons/Search';

class SectionalMenu extends React.Component {
  static propTypes = {
    goToSection: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    sessionManagement: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };
  search = () => {
    if (constants.PLATFORM_SECTION_SEARCH_DATASETS !== this.props.section) {
      if(!this.isUserAuthenticated()){
        this.triggerAuthWarning(constants.PLATFORM_SECTION_SEARCH_DATASETS)
      }else if (!this.isCurrentProjectSelected()) {
        this.triggerCurrentProjectWarning(constants.PLATFORM_SECTION_SEARCH_DATASETS);
      }else {
        this.props.goToSection(constants.PLATFORM_SECTION_SEARCH_DATASETS);
      }
    } else {
      this.props.goToSection('');
    }
  };
  experience = () => {
    if (constants.PLATFORM_SECTION_PROJECT_MANAGEMENT !== this.props.section) {
      if(!this.isUserAuthenticated()){
        this.triggerAuthWarning(constants.PLATFORM_SECTION_PROJECT_MANAGEMENT)
      } else {
        this.props.goToSection(constants.PLATFORM_SECTION_PROJECT_MANAGEMENT);
      }
    } else {
      this.props.goToSection('');
    }
  };
  monitor = () => {
    if (constants.PLATFORM_SECTION_MONITOR !== this.props.section) {
      if(!this.isUserAuthenticated()){
        this.triggerAuthWarning(constants.PLATFORM_SECTION_MONITOR)
      }else if (!this.isCurrentProjectSelected()) {
        this.triggerCurrentProjectWarning(constants.PLATFORM_SECTION_MONITOR);
      }else {
        this.props.goToSection(constants.PLATFORM_SECTION_MONITOR);
      }
    } else {
      this.props.goToSection('');
    }
  };
  workflows = () => {
    if (constants.PLATFORM_SECTION_WORKFLOWS !== this.props.section) {
      if(!this.isUserAuthenticated()){
        this.triggerAuthWarning(constants.PLATFORM_SECTION_WORKFLOWS)
      }else if (!this.isCurrentProjectSelected()) {
        this.triggerCurrentProjectWarning(constants.PLATFORM_SECTION_WORKFLOWS);
      }else {
        this.props.goToSection(constants.PLATFORM_SECTION_WORKFLOWS);
      }
    } else {
      this.props.goToSection('');
    }
  };
  account = () => {
    if (constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT !== this.props.section) {
      this.props.goToSection(constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT);
    } else {
      this.props.goToSection('');
    }
  };

  isUserAuthenticated () {
    return this.props.sessionManagement.sessionStatus &&
      this.props.sessionManagement.sessionStatus.user &&
      this.props.sessionManagement.sessionStatus.user.authenticated;
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
            className={(this.props.section === constants.PLATFORM_SECTION_SEARCH_DATASETS) ? classes['active'] : ''}>
            <SearchIcon />
          </a>
          <a id="cy-project-management" onClick={this.experience} title="Project Management"
            className={(this.props.section === constants.PLATFORM_SECTION_PROJECT_MANAGEMENT) ? classes['active'] : ''}>
            <AssignmentIcon />
          </a>
          <a id="cy-data-processing"onClick={this.workflows} title="Data Processing"
            className={(this.props.section === constants.PLATFORM_SECTION_WORKFLOWS) ? classes['active'] : ''}>
            <InputIcon />
          </a>
          <a id="cy-process-monitoring"onClick={this.monitor} title="Processes Monitoring"
            className={(this.props.section === constants.PLATFORM_SECTION_MONITOR) ? classes['active'] : ''}>
            <Glyphicon glyph="tasks" />
          </a>
          <a id="cy-account-management" onClick={this.account} title="Account Management"
            className={(this.props.section === constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT) ? classes['active'] : ''}>
            <AccountCircleIcon />
          </a>
        </nav>
      </div>
    );
  }
}
export default SectionalMenu;
