import React from 'react';
import classes from './Visualize.scss';
import OLComponent from '../../components/OLComponent';
import CurrentProjectSnackbar from '../../components/CurrentProjectSnackbar';
import {PieMenu} from '../PieMenu/PieMenu';
import TimeSlider from '../../components/TimeSlider';
import InformationPanel from '../../components/InformationPanel';
import LayerSwitcher from '../../components/LayerSwitcher';
import TimeSeriesChart from './../../components/TimeSeriesChart';
import MapControls from './../../components/MapControls';
import * as constants from '../../constants';
import BigColorPalette from '../BigColorPalette/BigColorPalette';
class Visualize extends React.Component {
  static propTypes = {
    goToSection: React.PropTypes.func.isRequired,
    project: React.PropTypes.object.isRequired,
    projectActions: React.PropTypes.object.isRequired,
    selectMapManipulationMode: React.PropTypes.func.isRequired,
    selectedDatasetCapabilities: React.PropTypes.object.isRequired,
    currentDisplayedDataset: React.PropTypes.object.isRequired,
    currentScalarValue: React.PropTypes.object.isRequired,
    currentVisualizedDatasets: React.PropTypes.array.isRequired,
    fetchShapefiles: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedBasemap: React.PropTypes.string.isRequired,
    selectCurrentDisplayedDataset: React.PropTypes.func.isRequired,
    selectShapefile: React.PropTypes.func.isRequired,
    selectBasemap: React.PropTypes.func.isRequired,
    // fetchFacets: React.PropTypes.func.isRequired,
    fetchPlotlyData: React.PropTypes.func.isRequired,
    panelControls: React.PropTypes.object.isRequired,
    plotlyData: React.PropTypes.object.isRequired,
    publicShapeFiles: React.PropTypes.array.isRequired,
    mapManipulationMode: React.PropTypes.string.isRequired,
    baseMaps: React.PropTypes.array.isRequired,
    currentDateTime: React.PropTypes.string.isRequired,
    fetchScalarValue: React.PropTypes.func.isRequired,
    fetchWMSLayerDetails: React.PropTypes.func.isRequired,
    fetchWMSLayerTimesteps: React.PropTypes.func.isRequired,
    selectedWMSLayerTimesteps: React.PropTypes.object.isRequired,
    selectedWMSLayerDetails: React.PropTypes.object.isRequired,
    setCurrentDateTime: React.PropTypes.func.isRequired,
    setSelectedDatasetCapabilities: React.PropTypes.func.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    selectedColorPalette: React.PropTypes.object.isRequired,
    selectColorPalette: React.PropTypes.func.isRequired,
    selectRegion: React.PropTypes.func.isRequired,
    unselectRegion: React.PropTypes.func.isRequired,
    resetSelectedRegions: React.PropTypes.func.isRequired,
    layer: React.PropTypes.any,
    visualize: React.PropTypes.object.isRequired,
    visualizeActions: React.PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    console.log(props);
    this._onToggleMapPanel = this._onToggleMapPanel.bind(this);
    this.setOLComponentReference = this.setOLComponentReference.bind(this);
    this.props.projectActions.setCurrentProject({id: 1, name: 'project-renaud-1'});
    let mapPanelStatus = {};
    mapPanelStatus[constants.VISUALIZE_INFO_PANEL] = false;
    mapPanelStatus[constants.VISUALIZE_MAP_CONTROLS_PANEL] = true;
    mapPanelStatus[constants.VISUALIZE_CHART_PANEL] = false;
    mapPanelStatus[constants.VISUALIZE_LAYER_SWITCHER_PANEL] = true;
    mapPanelStatus[constants.VISUALIZE_TIME_SLIDER_PANEL] = true;
    this.state = {
      mapPanelStatus: mapPanelStatus,
      OLComponentReference: {},
      variableMin: 0,
      variableMax: 0.0001
    };

    // TEST PURPOSE (TimeSlider): Load this dataset when opening the platform
    // let dataset = {
    //   "has_time": null,
    //   "cf_standard_name": "precipitation_flux",
    //   "abstract": [
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1961.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1962.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1963.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1964.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1965.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1966.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1967.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1968.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1969.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc"
    //   ],
    //   "replica": false,
    //   "wms_url": [
    //     "https://pluvier.crim.ca/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/ouranos/subdaily/aet/pcp/aet_pcp_1961.nc",
    //     "https://pluvier.crim.ca/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/ouranos/subdaily/aet/pcp/aet_pcp_1962.nc",
    //     "https://pluvier.crim.ca/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/ouranos/subdaily/aet/pcp/aet_pcp_1963.nc",
    //     "https://pluvier.crim.ca/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/ouranos/subdaily/aet/pcp/aet_pcp_1964.nc",
    //     "https://pluvier.crim.ca/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/ouranos/subdaily/aet/pcp/aet_pcp_1965.nc",
    //     "https://pluvier.crim.ca/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/ouranos/subdaily/aet/pcp/aet_pcp_1966.nc",
    //     "https://pluvier.crim.ca/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/ouranos/subdaily/aet/pcp/aet_pcp_1967.nc",
    //     "https://pluvier.crim.ca/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/ouranos/subdaily/aet/pcp/aet_pcp_1968.nc",
    //     "https://pluvier.crim.ca/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/ouranos/subdaily/aet/pcp/aet_pcp_1969.nc",
    //     "https://pluvier.crim.ca/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc"
    //   ],
    //   "keywords": [
    //     "precipitation_flux",
    //     "thredds",
    //     "sresa2",
    //     "application/netcdf",
    //     "PCP",
    //     "Ouranos",
    //     "Ouranos",
    //     "6hr",
    //     "CRCM"
    //   ],
    //   "dataset_id": "ouranos.subdaily.aet.pcp",
    //   "datetime_max": [
    //     "1961-12-31T18:00:00Z",
    //     "1962-12-31T18:00:00Z",
    //     //"1963-12-31T18:00:00Z",
    //     "1964-12-31T18:00:00Z",
    //     "1965-12-31T18:00:00Z",
    //     "1966-12-31T18:00:00Z",
    //     //"1967-12-31T18:00:00Z",
    //     //"1968-12-31T18:00:00Z",
    //     "1969-12-31T18:00:00Z",
    //     "1970-12-31T18:00:00Z"
    //   ],
    //   "frequency": "6hr",
    //   "data_min": null,
    //   "id": 6,
    //   "subject": "Birdhouse Thredds Catalog",
    //   "category": "thredds",
    //   "_version_": "NaN",
    //   "opendap_url": [
    //     "http://pluvier.crim.ca:8083/thredds/dodsC/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1961.nc",
    //     "http://pluvier.crim.ca:8083/thredds/dodsC/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1962.nc",
    //     "http://pluvier.crim.ca:8083/thredds/dodsC/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1963.nc",
    //     "http://pluvier.crim.ca:8083/thredds/dodsC/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1964.nc",
    //     "http://pluvier.crim.ca:8083/thredds/dodsC/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1965.nc",
    //     "http://pluvier.crim.ca:8083/thredds/dodsC/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1966.nc",
    //     "http://pluvier.crim.ca:8083/thredds/dodsC/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1967.nc",
    //     "http://pluvier.crim.ca:8083/thredds/dodsC/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1968.nc",
    //     "http://pluvier.crim.ca:8083/thredds/dodsC/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1969.nc",
    //     "http://pluvier.crim.ca:8083/thredds/dodsC/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc"
    //   ],
    //   "title": [
    //     "aet_pcp_1961.nc",
    //     "aet_pcp_1962.nc",
    //     "aet_pcp_1963.nc",
    //     "aet_pcp_1964.nc",
    //     "aet_pcp_1965.nc",
    //     "aet_pcp_1966.nc",
    //     "aet_pcp_1967.nc",
    //     "aet_pcp_1968.nc",
    //     "aet_pcp_1969.nc",
    //     "aet_pcp_1970.nc"
    //   ],
    //   "variable_palette": "default",
    //   "variable_long_name": "Total precipitation rate",
    //   "source": "http://pluvier.crim.ca:8083/thredds/catalog.xml",
    //   "datetime_min": [
    //     "1961-01-01T00:00:00Z",
    //     "1962-01-01T00:00:00Z",
    //     //"1963-01-01T00:00:00Z",
    //     "1964-01-01T00:00:00Z",
    //     "1965-01-01T00:00:00Z",
    //     "1966-01-01T00:00:00Z",
    //     //"1967-01-01T00:00:00Z",
    //     //"1968-01-01T00:00:00Z",
    //     "1969-01-01T00:00:00Z",
    //     "1970-01-01T00:00:00Z"
    //   ],
    //   "experiment": "sresa2",
    //   "variable_max": "1",
    //   "units": "kg m-2 s-1",
    //   "resourcename": [
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1961.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1962.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1963.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1964.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1965.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1966.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1967.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1968.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1969.nc",
    //     "birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc"
    //   ],
    //   "type": "Aggregate",
    //   "catalog_url": [
    //     "http://pluvier.crim.ca:8083/thredds/catalog/birdhouse/ouranos/subdaily/aet/pcp/catalog.xml?dataset=birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1961.nc",
    //     "http://pluvier.crim.ca:8083/thredds/catalog/birdhouse/ouranos/subdaily/aet/pcp/catalog.xml?dataset=birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1962.nc",
    //     "http://pluvier.crim.ca:8083/thredds/catalog/birdhouse/ouranos/subdaily/aet/pcp/catalog.xml?dataset=birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1963.nc",
    //     "http://pluvier.crim.ca:8083/thredds/catalog/birdhouse/ouranos/subdaily/aet/pcp/catalog.xml?dataset=birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1964.nc",
    //     "http://pluvier.crim.ca:8083/thredds/catalog/birdhouse/ouranos/subdaily/aet/pcp/catalog.xml?dataset=birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1965.nc",
    //     "http://pluvier.crim.ca:8083/thredds/catalog/birdhouse/ouranos/subdaily/aet/pcp/catalog.xml?dataset=birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1966.nc",
    //     "http://pluvier.crim.ca:8083/thredds/catalog/birdhouse/ouranos/subdaily/aet/pcp/catalog.xml?dataset=birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1967.nc",
    //     "http://pluvier.crim.ca:8083/thredds/catalog/birdhouse/ouranos/subdaily/aet/pcp/catalog.xml?dataset=birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1968.nc",
    //     "http://pluvier.crim.ca:8083/thredds/catalog/birdhouse/ouranos/subdaily/aet/pcp/catalog.xml?dataset=birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1969.nc",
    //     "http://pluvier.crim.ca:8083/thredds/catalog/birdhouse/ouranos/subdaily/aet/pcp/catalog.xml?dataset=birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc"
    //   ],
    //   "aggregate_title": "ouranos.subdaily.aet.pcp",
    //   "last_modified": [
    //     "2016-07-21T13:31:32Z",
    //     "2016-07-21T13:31:25Z",
    //     "2016-07-21T13:31:45Z",
    //     "2016-07-21T13:31:47Z",
    //     "2016-07-21T13:31:24Z",
    //     "2016-07-21T13:32:04Z",
    //     "2016-07-21T13:31:22Z",
    //     "2016-07-21T13:31:54Z",
    //     "2016-07-21T13:32:00Z",
    //     "2016-07-21T13:31:49Z"
    //   ],
    //   "content_type": "application/netcdf",
    //   "variable_min": "0",
    //   "variable": "PCP",
    //   "url": [
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1961.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1962.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1963.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1964.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1965.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1966.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1967.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1968.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1969.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc"
    //   ],
    //   "institute": "Ouranos",
    //   "model": "CRCM",
    //   "fileserver_url": [
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1961.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1962.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1963.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1964.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1965.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1966.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1967.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1968.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1969.nc",
    //     "http://pluvier.crim.ca:8083/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc"
    //   ],
    //   "latest": true,
    //   "projectId": 1,
    //   "researchId": null,
    //   "project": "Ouranos",
    //   "opacity": 0.8,
    //   "currentFileIndex": 0
    // };
    // this.props.addDatasetsToVisualize([dataset]);
    // this.props.selectCurrentDisplayedDataset(dataset);
  }

  _onToggleMapPanel (panel) {
    let mapPanelStatus = this.state.mapPanelStatus;
    mapPanelStatus[panel] = !mapPanelStatus[panel];
    this.setState({
      mapPanelStatus: mapPanelStatus,
      OLComponentReference: this.state.OLComponentReference
    });
    console.log(panel);
  }

  setOLComponentReference (ref) {
    this.setState({
      mapPanelStatus: this.state.mapPanelStatus,
      OLComponentReference: ref
    });
  }

  render () {
    let selectModeCallback = (event, value) => {
      this.props.selectMapManipulationMode(value);
    };
    return (
      <div>
        <div className={classes['Visualize']}>
          <div className={classes.mapContainer}>
            <OLComponent
              selectRegion={this.props.selectRegion}
              unselectRegion={this.props.unselectRegion}
              currentDateTime={this.props.currentDateTime}
              fetchPlotlyData={this.props.fetchPlotlyData}
              fetchScalarValue={this.props.fetchScalarValue}
              fetchWMSLayerDetails={this.props.fetchWMSLayerDetails}
              fetchWMSLayerTimesteps={this.props.fetchWMSLayerTimesteps}
              layer={this.props.layer}
              mapManipulationMode={this.props.mapManipulationMode}
              selectedBasemap={this.props.selectedBasemap}
              selectedColorPalette={this.props.selectedColorPalette}
              selectedDatasetCapabilities={this.props.selectedDatasetCapabilities}
              currentDisplayedDataset={this.props.currentDisplayedDataset}
              selectedRegions={this.props.selectedRegions}
              selectedShapefile={this.props.selectedShapefile}
              setCurrentDateTime={this.props.setCurrentDateTime}
              setSelectedDatasetCapabilities={this.props.setSelectedDatasetCapabilities}
              ref={this.setOLComponentReference} />
          </div>
          <BigColorPalette
            variablePreference={this.props.variablePreferences[this.props.currentDisplayedDataset.variable]}
            setVariableMax={this.props.visualizeActions.setVariableMax}
            setVariableMin={this.props.visualizeActions.setVariableMin}
            selectedColorPalette={this.props.selectedColorPalette} />
          <PieMenu
            mapPanelStatus={this.state.mapPanelStatus}
            onToggleMapPanel={this._onToggleMapPanel} />
          <div className={classes.left}>
            {
              (this.state.mapPanelStatus[constants.VISUALIZE_INFO_PANEL])
              ? <div className={classes.panel}>
                  <InformationPanel
                    onToggleMapPanel={this._onToggleMapPanel}
                    currentScalarValue={this.props.currentScalarValue} />
                </div>
              : null
            }
            {
              (this.state.mapPanelStatus[constants.VISUALIZE_CHART_PANEL])
              ? <div className={classes.panel}>
                <TimeSeriesChart
                  currentScalarValue={this.props.currentScalarValue}
                  currentDisplayedDataset={this.props.currentDisplayedDataset}
                  onToggleMapPanel={this._onToggleMapPanel}
                  plotlyData={this.props.plotlyData}
                  fetchPlotlyData={this.props.fetchPlotlyData}
                />
              </div> : null
            }
            {
              (this.state.mapPanelStatus[constants.VISUALIZE_LAYER_SWITCHER_PANEL])
                ? <div className={classes['panel']}>
                  <LayerSwitcher
                    resetSelectedRegions={this.props.resetSelectedRegions}
                    onToggleMapPanel={this._onToggleMapPanel}
                    selectColorPalette={this.props.selectColorPalette}
                    selectedColorPalette={this.props.selectedColorPalette}
                    fetchShapefiles={this.props.fetchShapefiles}
                    selectCurrentDisplayedDataset={this.props.selectCurrentDisplayedDataset}
                    selectShapefile={this.props.selectShapefile}
                    selectBasemap={this.props.selectBasemap}
                    currentVisualizedDatasets={this.props.currentVisualizedDatasets}
                    currentDisplayedDataset={this.props.currentDisplayedDataset}
                    selectedShapefile={this.props.selectedShapefile}
                    selectedBasemap={this.props.selectedBasemap}
                    publicShapeFiles={this.props.publicShapeFiles}
                    baseMaps={this.props.baseMaps} />
                </div> : null
            }
            {(this.state.mapPanelStatus[constants.VISUALIZE_TIME_SLIDER_PANEL])
              ? <div className={classes.panel}>
                <TimeSlider
                  selectedWMSLayerDetails={this.props.selectedWMSLayerDetails}
                  selectedWMSLayerTimesteps={this.props.selectedWMSLayerTimesteps}
                  setCurrentDateTime={this.props.setCurrentDateTime}
                  selectCurrentDisplayedDataset={this.props.selectCurrentDisplayedDataset}
                  currentDisplayedDataset={this.props.currentDisplayedDataset}
                  selectedDatasetCapabilities={this.props.selectedDatasetCapabilities}
                  currentDateTime={this.props.currentDateTime}
                  monthsRange={false}
                  yearsRange={false}
                  onToggleMapPanel={this._onToggleMapPanel} />
              </div> : null
            }
            {
              this.state.mapPanelStatus[constants.VISUALIZE_MAP_CONTROLS_PANEL]
                ? <div className={classes['panel']} style={{clear: 'left'}}>
                  <MapControls
                    onToggleMapPanel={this._onToggleMapPanel}
                    selectMapManipulationMode={selectModeCallback} />
                </div> : null
            }
          </div>
          <CurrentProjectSnackbar
            project={this.props.project}
            goToSection={this.props.goToSection}
          />
        </div>
      </div>
    );
  }
}
export default Visualize;
