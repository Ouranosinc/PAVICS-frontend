import React from 'react';
import { Grid, Row, Col, Nav, NavItem } from 'react-bootstrap';
import * as constants from './../../constants';
class Header extends React.Component {
  static propTypes = {
    goToSection: React.PropTypes.func.isRequired,
    chooseStep: React.PropTypes.func.isRequired
  };
  search = () => {
    this.props.goToSection(constants.PLATFORM_SECTION_SEARCH_DATASETS);
  };
  experience = () => {
    this.props.goToSection(constants.PLATFORM_SECTION_EXPERIENCE_MANAGEMENT);
  };
  monitor = () => {
    this.props.goToSection(constants.PLATFORM_SECTION_MONITOR);
  };
  workflows = () => {
    this.props.chooseStep(constants.WORKFLOW_STEP_PROCESS);
    this.props.goToSection(constants.PLATFORM_SECTION_WORKFLOWS);
  };
  account = () => {
    this.props.goToSection(constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT);
  };
  render () {
    return (
      <Grid>
        <Row className="schow-grid">
          <Col md={4} mdOffset={4}>
            <Nav bsStyle="pills" justified>
              <NavItem onClick={this.search}>Search datasets</NavItem>
              <NavItem onClick={this.experience}>Experience Management</NavItem>
              <NavItem onClick={this.workflows}>Workflow Wizard</NavItem>
              <NavItem onClick={this.monitor}>Workboard</NavItem>
              <NavItem onClick={this.account}>Account Management</NavItem>
            </Nav>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default Header;
