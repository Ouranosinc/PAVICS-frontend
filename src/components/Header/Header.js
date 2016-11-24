import React from 'react';
import { Grid, Row, Col, Nav, NavItem } from 'react-bootstrap';
class Header extends React.Component {
  render () {
    return (
      <Grid>
        <Row className="schow-grid">
          <Col md={4} mdOffset={4}>
            <Nav bsStyle="pills" justified>
              <NavItem href="/">Workflow Wizard</NavItem>
              <NavItem href="/visualize">Visualize</NavItem>
              <NavItem href="/workboard">Workboard</NavItem>
            </Nav>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default Header;
