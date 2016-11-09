import React from 'react';
import ProcessesSelector from './../../components/ProcessesSelector';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
class WorkflowWizard extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired
  };
  render () {
    return (
      <Grid>
        <Row className="show-grid">
          <Col md={8} mdOffset={2}>
            <Panel header="Choose workflow">
              <ProcessesSelector
                processes={this.props.processes}
              />
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default WorkflowWizard;

