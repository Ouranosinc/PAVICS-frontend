import React from 'react';
import ScientificWorkflowStepper from '../../components/ScientificWorkflowStepper';
import WorkflowWizardStepper from '../../components/WorkflowWizard';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';
export default class WorkflowWizard extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    stepIndex: React.PropTypes.number.isRequired,
    selectedProcess: React.PropTypes.object.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    selectedProcessValues: React.PropTypes.object.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    saveWorkflow: React.PropTypes.func.isRequired,
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    fetchProviders: React.PropTypes.func.isRequired,
    fetchWorkflows: React.PropTypes.func.isRequired,
    deleteWorkflow: React.PropTypes.func.isRequired,
    fetchProcesses: React.PropTypes.func.isRequired,
    setProcessInputs: React.PropTypes.func.isRequired,
    fetchProcessInputs: React.PropTypes.func.isRequired,
    selectWpsProvider: React.PropTypes.func.isRequired,
    providers: React.PropTypes.object.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    getLastStep: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    workflows: React.PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.deleteWorkflowCallback = this.deleteWorkflowCallback.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.props.fetchProviders();
    if (this.props.selectedProvider) {
      this.props.fetchProcesses(this.props.selectedProvider);
    }
    this.state = {
      dialogOpened: false,
      dialogTitle: '',
      dialogContent: '',
      dialogActions: []
    };
  }

  componentDidMount () {
    this.props.fetchWorkflows();
  }

  deleteWorkflowCallback (id) {
    this.props.deleteWorkflow(id);
  }

  openDialog () {
    this.setState({
      dialogOpened: true
    });
  }

  closeDialog () {
    this.setState({
      dialogOpened: false
    });
  }

  showDialog (title, content, actions) {
    const defaultDialogActions = [
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.closeDialog}
      />
    ];
    this.setState({
      dialogOpened: true,
      dialogTitle: title,
      dialogContent: content,
      dialogActions: actions ? actions : defaultDialogActions
    });
  }

  render () {
    /*
     selectedProcess={{identifier: 'workflow'}} and selectedProvider="malleefowl"
     maybe someday refactor with only the identifier, after confirming it's all that's ever needed
     we are hardcoding those for the ScientificWorkflowStepper because it's actually always the same workflow
     //
     */
    return (
      <div>
        <Tabs>
          <Tab label="Scientific Workflows">
            <ScientificWorkflowStepper
              setProcessInputs={this.props.setProcessInputs}
              showDialog={this.showDialog}
              providers={this.props.providers}
              selectedRegions={this.props.selectedRegions}
              selectedDatasetLayer={this.props.selectedDatasetLayer}
              selectedShapefile={this.props.selectedShapefile}
              goToSection={this.props.goToSection}
              executeProcess={this.props.executeProcess}
              handleSelectedProcessValueChange={this.props.handleSelectedProcessValueChange}
              selectedProcess={{identifier: 'workflow'}}
              selectedProcessInputs={this.props.selectedProcessInputs}
              selectedProcessValues={this.props.selectedProcessValues}
              selectedProvider="malleefowl"
              workflows={this.props.workflows}
              saveWorkflow={this.props.saveWorkflow}
              deleteWorkflowCallback={this.deleteWorkflowCallback}/>
          </Tab>
          <Tab label="WPS Processes">
            <WorkflowWizardStepper
              selectedRegions={this.props.selectedRegions}
              selectedDatasetLayer={this.props.selectedDatasetLayer}
              selectedShapefile={this.props.selectedShapefile}
              stepIndex={this.props.stepIndex}
              processes={this.props.processes}
              chooseProcess={this.props.chooseProcess}
              fetchProcessInputs={this.props.fetchProcessInputs}
              selectWpsProvider={this.props.selectWpsProvider}
              providers={this.props.providers}
              selectedProvider={this.props.selectedProvider}
              getLastStep={this.props.getLastStep}
              selectedProcess={this.props.selectedProcess}
              selectedProcessValues={this.props.selectedProcessValues}
              selectedProcessInputs={this.props.selectedProcessInputs}
              goToSection={this.props.goToSection}
              executeProcess={this.props.executeProcess}
              handleSelectedProcessValueChange={this.props.handleSelectedProcessValueChange}/>
          </Tab>
        </Tabs>
        <Dialog
          open={this.state.dialogOpened}
          title={this.state.dialogTitle}
          onRequestClose={this.closeDialog}
          actions={this.state.dialogActions}
          modal={true}>
          {this.state.dialogContent}
        </Dialog>
      </div>

    );
  }
}

