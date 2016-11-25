import React from 'react';
import {ProcessesSelector, ProcessDetails, ProcessForm} from './../../components/WorkflowWizard';
import {Panel, Grid, Row, Col} from 'react-bootstrap';
import * as constants from './../../constants';
class WorkflowWizard extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    currentStep: React.PropTypes.string.isRequired,
    selectedProcess: React.PropTypes.object.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    executeProcess: React.PropTypes.func.isRequired
  }

  makeSection () {
    console.log(this.props.selectedProcessInputs);
    switch (this.props.currentStep) {
      case constants.WORKFLOW_STEP_PROCESS:
        return (
          <Panel header="Choose workflow">
            <ProcessesSelector {...this.props} />
          </Panel>
        );
      case constants.WORKFLOW_STEP_INPUTS:
        return (
          <Grid>
            <Row>
              <Col md={4}>
                <Panel header="Workflow Detail">
                  <ProcessDetails
                    selectedProcess={this.props.selectedProcess}
                  />
                </Panel>
              </Col>
              <Col md={8}>
                <Panel header="Choose Inputs">
                  {
                    this.props.selectedProcessInputs.length === 0
                      ? null
                      : <ProcessForm inputs={this.props.selectedProcessInputs} />
                  }
                </Panel>
              </Col>
            </Row>
          </Grid>
        );
    }
  }

  render () {
    return (
      <Grid>
        <Row>
          <Col md={8} mdOffset={2}>
            {this.makeSection()}
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default WorkflowWizard;

