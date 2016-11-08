import React from 'react';
import { Button, ButtonGroup, Grid, Row, Col } from 'react-bootstrap';
class Header extends React.Component {
  render () {
    return (
      <Grid>
        <Row className="schow-grid">
          <Col md={4} mdOffset={4}>
            <ButtonGroup justified>
              <Button href="/Gandalf">Gandalf</Button>
              <Button href="/Visualize">Visualize</Button>
              <Button href="/Workboard">Workboard</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default Header;
