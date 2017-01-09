import React from 'react';
import { Grid, Row, Col, Nav, NavItem } from 'react-bootstrap';
import * as constants from './../../constants';
class Header extends React.Component {
  static propTypes = {
    goToSection: React.PropTypes.func.isRequired,
    chooseStep: React.PropTypes.func.isRequired
  };
  monitor = () => {
    this.props.goToSection(constants.PLATFORM_SECTION_MONITOR);
  };
  workflows = () => {
    this.props.chooseStep(constants.WORKFLOW_STEP_PROCESS);
    this.props.goToSection(constants.PLATFORM_SECTION_WORKFLOWS);
  };
  visualize = () => {
    this.props.goToSection(constants.PLATFORM_SECTION_VISUALIZE);
  };
  render () {
    return (
      <Grid>
        <Row className="schow-grid">
          <Col md={4} mdOffset={4}>
            <Nav bsStyle="pills" justified>
              <NavItem onClick={this.workflows}>Workflow Wizard</NavItem>
              <NavItem onClick={this.monitor}>Workboard</NavItem>
              <NavItem onClick={this.visualize}>Visualize</NavItem>
            </Nav>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default Header;
