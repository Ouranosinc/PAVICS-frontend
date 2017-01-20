import React from 'react';
import {ProcessDetails, ProcessForm} from './../../components/WorkflowWizard';
import WorkflowWizardStepper from './../../components/WorkflowWizard';
import {Panel, Grid, Row, Col} from 'react-bootstrap';
import * as constants from './../../constants';
class WorkflowWizard extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    currentStep: React.PropTypes.string.isRequired, // duplicated for now because changing method
    stepIndex: React.PropTypes.number.isRequired,
    selectedProcess: React.PropTypes.object.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    selectedProcessValues: React.PropTypes.object.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    fetchProviders: React.PropTypes.func.isRequired,
    fetchProcesses: React.PropTypes.func.isRequired,
    fetchProcessInputs: React.PropTypes.func.isRequired,
    selectWpsProvider: React.PropTypes.func.isRequired,
    providers: React.PropTypes.object.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    getLastStep: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.props.fetchProviders();
    if (this.props.selectedProvider) {
      this.props.fetchProcesses(this.props.selectedProvider);
    }
  }

  makeSection () {
    switch (this.props.currentStep) {
      case constants.WORKFLOW_STEP_PROCESS:
        return (
          <div>not supposed to be used anymore</div>
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
                      : <ProcessForm
                        goToSection={this.props.goToSection}
                        executeProcess={this.props.executeProcess}
                        handleSelectedProcessValueChange={this.props.handleSelectedProcessValueChange}
                        selectedProcess={this.props.selectedProcess}
                        selectedProcessInputs={this.props.selectedProcessInputs}
                        selectedProcessValues={this.props.selectedProcessValues}
                        selectedProvider={this.props.selectedProvider} />
                  }
                </Panel>
              </Col>
            </Row>
          </Grid>
        );
    }
  }

  renderOld () {
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

  render () {
    return <WorkflowWizardStepper
      stepIndex={this.props.stepIndex}
      processes={this.props.processes}
      chooseProcess={this.props.chooseProcess}
      fetchProcessInputs={this.props.fetchProcessInputs}
      selectWpsProvider={this.props.selectWpsProvider}
      providers={this.props.providers}
      selectedProvider={this.props.selectedProvider}
      getLastStep={this.props.getLastStep} />;
  }
}
export default WorkflowWizard;

