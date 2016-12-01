import {Panel, Grid, Row, Col, Button} from 'react-bootstrap';
import React from 'react';
class Monitor extends React.Component {
  static propTypes = {
    fetchJobs: React.PropTypes.func.isRequired,
    monitor: React.PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.props.fetchJobs();
  }

  visualizeResult () {

  }

  render () {
    return (
      <Grid>
        <Row>
          <Col mdOffset={2} md={8}>
            <Panel header="Jobs">
              {
                this.props.monitor.jobs.map((job, i) => {
                  return (
                    <div key={i}>
                      <Button onClick="">Visualize</Button>
                      {job.title} - <a href={job.status_location}>results</a>
                    </div>
                  );
                })
              }
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default Monitor;
