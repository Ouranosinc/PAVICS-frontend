import React from 'react';
import {connect} from 'react-redux';
import {WorkflowWizard, Monitor, Visualize} from './../../../containers';
import Header from './../../../components/Header';
import * as actionCreators from './../modules/Pavics';
import * as constants from './../../../constants';
import Map from './../../../components/Map';
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
      case constants.PLATFORM_SECTION_VISUALIZE:
        return (
          <Visualize {...this.props} />
        );
      case constants.PLATFORM_SECTION_OLCOMPONENT:
        return (
          <Map />
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
    monitor: state.pavics.monitor,
    currentSelectedKey: state.pavics.visualize.currentSelectedKey,
    currentSelectedValue: state.pavics.visualize.currentSelectedValue,
    currentOpenedDataset: state.pavics.visualize.currentOpenedDataset,
    currentOpenedDatasetWMSFile: state.pavics.visualize.currentOpenedDatasetWMSFile,
    currentOpenedWMSLayer: state.pavics.visualize.currentOpenedWMSLayer,
    loadedWmsDatasets: state.pavics.visualize.loadedWmsDatasets,
    selectedFacets: state.pavics.visualize.selectedFacets,
    selectedDatasets: state.pavics.visualize.selectedDatasets,
    selectedWMSLayers: state.pavics.visualize.selectedWMSLayers,
    datasets: state.pavics.visualize.datasets,
    facets: state.pavics.visualize.facets,
    climateIndicators: state.pavics.visualize.climateIndicators,
    panelControls: state.pavics.visualize.panelControls,
    plotlyData: state.pavics.visualize.plotlyData
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
