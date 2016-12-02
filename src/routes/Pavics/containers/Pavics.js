import React from 'react';
import {connect} from 'react-redux';
import {WorkflowWizard, Monitor} from './../../../containers';
import Header from './../../../components/Header';
import * as actionCreators from './../modules/Pavics';
import * as constants from './../../../constants';
class Pavics extends React.Component {
  static propTypes = {
    platform: React.PropTypes.object.isRequired
  };
  makeSection () {
    switch (this.props.platform.section) {
      case constants.PLATFORM_SECTION_WORKFLOWS:
        return (
          <WorkflowWizard {...this.props} />
        );
      case constants.PLATFORM_SECTION_MONITOR:
        return (
          <Monitor {...this.props} />
        );
    }
  }
  render () {
    return (
      <div>
        <Header {...this.props} />
        {this.makeSection()}
      </div>
    );
  }
}
const mapActionCreators = {...actionCreators};
const mapStateToProps = (state) => {
  return {
    processes: state.pavics.workflowWizard.processes,
    currentStep: state.pavics.workflowWizard.currentStep,
    selectedProcess: state.pavics.workflowWizard.selectedProcess,
    selectedProcessInputs: state.pavics.workflowWizard.selectedProcessInputs,
    selectedProcessValues: state.pavics.workflowWizard.selectedProcessValues,
    providers: state.pavics.workflowWizard.providers,
    platform: state.pavics.platform,
    monitor: state.pavics.monitor
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
