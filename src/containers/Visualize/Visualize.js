import React from 'react';
import classes from './Visualize.scss';
// TODO: Fix, we should only import containers here
import OLComponent from '../../components/OLComponent';
import { PieMenu } from './../../components/PieMenu/PieMenu';
import TimeSlider from '../../containers/TimeSlider';
import LayerSwitcher from '../../components/LayerSwitcher';
import TimeSeriesChart from './../../components/TimeSeriesChart';
import MapControls from './../../components/MapControls';
import * as constants from './../../constants';
class Visualize extends React.Component {
  static propTypes = {
    selectMapManipulationMode: React.PropTypes.func.isRequired,
    selectedDatasetCapabilities: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    currentScalarValue: React.PropTypes.object.isRequired,
    currentVisualizedDatasetLayers: React.PropTypes.array.isRequired,
    fetchShapefiles: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedBasemap: React.PropTypes.string.isRequired,
    selectDatasetLayer: React.PropTypes.func.isRequired,
    selectShapefile: React.PropTypes.func.isRequired,
    selectBasemap: React.PropTypes.func.isRequired,
    fetchFacets: React.PropTypes.func.isRequired,
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
    selectColorPalette: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    console.log(props);
    this._onToggleMapPanel = this._onToggleMapPanel.bind(this);
    this.setOLComponentReference = this.setOLComponentReference.bind(this);
    let mapPanelStatus = {};
    mapPanelStatus[constants.VISUALIZE_INFO_PANEL] = false;
    mapPanelStatus[constants.VISUALIZE_MAP_CONTROLS_PANEL] = true;
    mapPanelStatus[constants.VISUALIZE_CHART_PANEL] = false;
    mapPanelStatus[constants.VISUALIZE_LAYER_SWITCHER_PANEL] = true;
    mapPanelStatus[constants.VISUALIZE_TIME_SLIDER_PANEL] = true;
    this.state = {
      mapPanelStatus: mapPanelStatus,
      OLComponentReference: {}
    };
    this.props.fetchFacets();
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
              selectedDatasetLayer={this.props.selectedDatasetLayer}
              selectedRegions={this.props.selectedRegions}
              selectedShapefile={this.props.selectedShapefile}
              setCurrentDateTime={this.props.setCurrentDateTime}
              setSelectedDatasetCapabilities={this.props.setSelectedDatasetCapabilities}
              ref={this.setOLComponentReference} />
          </div>
          {(this.state.mapPanelStatus[constants.VISUALIZE_INFO_PANEL])
            ? <div></div> : null
          }
          <PieMenu
            mapPanelStatus={this.state.mapPanelStatus}
            onToggleMapPanel={this._onToggleMapPanel} />
          <div className={classes.left}>
            {(this.state.mapPanelStatus[constants.VISUALIZE_CHART_PANEL])
              ? <div className={classes.panel}>
                <TimeSeriesChart
                  currentScalarValue={this.props.currentScalarValue}
                  selectedDatasetLayer={this.props.selectedDatasetLayer}
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
                    onToggleMapPanel={this._onToggleMapPanel}
                    selectColorPalette={this.props.selectColorPalette}
                    selectedColorPalette={this.props.selectedColorPalette}
                    fetchShapefiles={this.props.fetchShapefiles}
                    selectDatasetLayer={this.props.selectDatasetLayer}
                    selectShapefile={this.props.selectShapefile}
                    selectBasemap={this.props.selectBasemap}
                    currentVisualizedDatasetLayers={this.props.currentVisualizedDatasetLayers}
                    selectedDatasetLayer={this.props.selectedDatasetLayer}
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
                  selectedDatasetLayer={this.props.selectedDatasetLayer}
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
        </div>
      </div>
    );
  }
}
export default Visualize;
