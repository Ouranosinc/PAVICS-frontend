import React from 'react';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
class Gandalf extends React.Component {
  static propTypes = {
  };
  render () {
    return (
      <Grid>
        <Row className="show-grid">
          <Col md={8} mdOffset={2}>
            <Panel header="Choose workflow">hello worlds</Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}
const mapActionCreators = {};
const mapStateToProps = (state) => ({
});
export default connect(mapStateToProps, mapActionCreators)(Gandalf);
