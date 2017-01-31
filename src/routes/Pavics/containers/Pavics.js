import React from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as actionCreators from './../modules/Pavics';
import * as constants from './../../../constants';
import DatasetDetails from './../../../components/DatasetDetails';
import {
  AccountManagement,
  DatasetWMSLayers,
  ExperienceManagement,
  SearchCatalog,
  WorkflowWizard,
  Monitor,
  Visualize } from './../../../containers';
import { SectionalPanel } from './../../../components/SectionalPanel';

class Pavics extends React.Component {
  static propTypes = {
    chooseStep: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    platform: React.PropTypes.object.isRequired
  };

  makeSection () {
    switch (this.props.platform.section) {
      case constants.PLATFORM_SECTION_SEARCH_DATASETS:
        return (
          <div>
            <SearchCatalog {...this.props} />
          </div>
        );
      case constants.PLATFORM_SECTION_EXPERIENCE_MANAGEMENT:
        return (
          <ExperienceManagement />
        );
      case constants.PLATFORM_SECTION_WORKFLOWS:
        return (
          <WorkflowWizard {...this.props} />
        );
      case constants.PLATFORM_SECTION_MONITOR:
        return (
          <Monitor {...this.props} />
        );
      case constants.PLATFORM_SECTION_ACCOUNT_MANAGEMENT:
        return (
          <div>
            <AccountManagement {...this.props} />
            <DatasetDetails {...this.props} />
            <DatasetWMSLayers {...this.props} />
          </div>
        );
      default:
        return null;
    }
  }

  render () {
    return (
      <MuiThemeProvider>
        <div>
          <Visualize {...this.props} />
          <SectionalPanel
            section={this.props.platform.section}
            goToSection={this.props.goToSection}
            chooseStep={this.props.chooseStep}
            showContent={this.makeSection() !== null}
            currentContent={this.makeSection()} />
        </div>
      </MuiThemeProvider>
    );
  }
}
const mapActionCreators = {...actionCreators};
const mapStateToProps = (state) => {
  return {
    processes: state.pavics.workflowWizard.processes,
    currentStep: state.pavics.workflowWizard.currentStep,
    stepIndex: state.pavics.workflowWizard.stepIndex,
    selectedProcess: state.pavics.workflowWizard.selectedProcess,
    selectedProvider: state.pavics.workflowWizard.selectedProvider,
    selectedProcessInputs: state.pavics.workflowWizard.selectedProcessInputs,
    selectedProcessValues: state.pavics.workflowWizard.selectedProcessValues,
    providers: state.pavics.workflowWizard.providers,
    platform: state.pavics.platform,
    monitor: state.pavics.monitor,
    currentOpenedDataset: state.pavics.visualize.currentOpenedDataset,
    currentOpenedDatasetWMSFile: state.pavics.visualize.currentOpenedDatasetWMSFile,
    currentOpenedWMSLayer: state.pavics.visualize.currentOpenedWMSLayer,
    loadedWmsDatasets: state.pavics.visualize.loadedWmsDatasets,
    selectedFacets: state.pavics.visualize.selectedFacets,
    selectedDatasets: state.pavics.visualize.selectedDatasets,
    selectedWMSLayers: state.pavics.visualize.selectedWMSLayers,
    selectedWMSLayerDetails: state.pavics.visualize.selectedWMSLayerDetails,
    selectedWMSLayerTimesteps: state.pavics.visualize.selectedWMSLayerTimesteps,
    currentDateTime: state.pavics.visualize.currentDateTime,
    esgfDatasets: state.pavics.visualize.esgfDatasets,
    pavicsDatasets: state.pavics.visualize.pavicsDatasets,
    facets: state.pavics.visualize.facets,
    climateIndicators: state.pavics.visualize.climateIndicators,
    panelControls: state.pavics.visualize.panelControls,
    plotlyData: state.pavics.visualize.plotlyData,
    layer: state.pavics.visualize.layer,
    publicShapeFiles: state.pavics.visualize.publicShapeFiles
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
