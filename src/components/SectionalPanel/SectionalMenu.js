import React from 'react';
import classes from './SectionalPanel.scss';
import { Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as constants from './../../constants';
import AccountCircleIcon from 'material-ui/svg-icons/action/account-circle';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment';
import InputIcon from 'material-ui/svg-icons/action/input';
import SearchIcon from 'material-ui/svg-icons/action/search';
import {white} from 'material-ui/styles/colors';

class SectionalMenu extends React.Component {
  static propTypes = {
    // chooseStep: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    section: React.PropTypes.string.isRequired
  };
  search = () => {
    if (constants.PLATFORM_SECTION_SEARCH_DATASETS !== this.props.section) {
      this.props.goToSection(constants.PLATFORM_SECTION_SEARCH_DATASETS);
    } else {
      this.props.goToSection('');
    }
  };
  experience = () => {
    if (constants.PLATFORM_SECTION_PROJECT_MANAGEMENT !== this.props.section) {
      this.props.goToSection(constants.PLATFORM_SECTION_PROJECT_MANAGEMENT);
    } else {
      this.props.goToSection('');
    }
  };
  monitor = () => {
    if (constants.PLATFORM_SECTION_MONITOR !== this.props.section) {
      this.props.goToSection(constants.PLATFORM_SECTION_MONITOR);
    } else {
      this.props.goToSection('');
    }
  };
  workflows = () => {
    if (constants.PLATFORM_SECTION_WORKFLOWS !== this.props.section) {
      this.props.goToSection(constants.PLATFORM_SECTION_WORKFLOWS);
    } else {
      this.props.goToSection('');
    }
    // this.props.workflowActions.chooseStep(constants.WORKFLOW_STEP_PROCESS);
  };
  account = () => {
    if (constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT !== this.props.section) {
      this.props.goToSection(constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT);
    } else {
      this.props.goToSection('');
    }
  };

  tooltip (label) {
    return (<Tooltip id="tooltip">{label}</Tooltip>);
  }

  render () {
    return (
      <div className={classes['SectionalMenu']}>
        <nav>
          <OverlayTrigger placement="left" overlay={this.tooltip('Search Datasets')} delay={10}>
            <a onClick={this.search} title="Search Datasets"
              className={(this.props.section === constants.PLATFORM_SECTION_SEARCH_DATASETS) ? classes['active'] : ''}>
              <SearchIcon color={white} />
            </a>
          </OverlayTrigger>
          <OverlayTrigger placement="left" overlay={this.tooltip('Project Management')} delay={10}>
            <a onClick={this.experience} title="Project Management"
              className={(this.props.section === constants.PLATFORM_SECTION_PROJECT_MANAGEMENT) ? classes['active'] : ''}>
              <AssignmentIcon color={white} />
            </a>
          </OverlayTrigger>
          <OverlayTrigger placement="left" overlay={this.tooltip('Workflow Wizard')} delay={10}>
            <a onClick={this.workflows} title="Workflow Wizard"
              className={(this.props.section === constants.PLATFORM_SECTION_WORKFLOWS) ? classes['active'] : ''}>
              <InputIcon color={white} />
            </a>
          </OverlayTrigger>
          <OverlayTrigger placement="left" overlay={this.tooltip('Monitoring Jobs')} delay={10}>
            <a onClick={this.monitor} title="Monitoring Jobs"
              className={(this.props.section === constants.PLATFORM_SECTION_MONITOR) ? classes['active'] : ''}>
              <Glyphicon glyph="tasks" />
            </a>
          </OverlayTrigger>
          <OverlayTrigger placement="left" overlay={this.tooltip('Account Management')} delay={10}>
            <a onClick={this.account} title="Account Management"
              className={(this.props.section === constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT) ? classes['active'] : ''}>
              <AccountCircleIcon color={white} />
            </a>
          </OverlayTrigger>
        </nav>
      </div>
    );
  }
}
export default SectionalMenu;
