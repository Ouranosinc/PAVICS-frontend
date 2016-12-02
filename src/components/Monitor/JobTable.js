import {Panel, Grid, Row, Col, Button} from 'react-bootstrap';
import React from 'react';
class JobTable extends React.Component {
  static propTypes = {
    jobs: React.PropTypes.array.isRequired
  };
  render () {
    return (
      <Grid>
        <Row>
          <Col mdOffset={2} md={8}>
            <Panel header="Jobs">
              {
                this.props.jobs.map((job, i) => {
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
export default JobTable;
