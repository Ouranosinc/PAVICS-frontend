import React from 'react';
import classes from './Visualize.scss';
// TODO: Fix, we should only import containers here
import OLComponent from '../../components/OLComponent';
import { PieMenu, CHART_PANEL, LAYER_SWITCHER_PANEL, MAP_PANEL, MAP_CONTROLS_PANEL, TIME_SLIDER_PANEL } from '../../components/PieMenu/PieMenu';
import TimeSlider from '../../containers/TimeSlider';
import PlotlyWrapper from '../../components/PlotlyWrapper';
import * as constants from './../../constants';

class Visualize extends React.Component {
  static propTypes = {
    fetchFacets: React.PropTypes.func.isRequired,
    fetchPlotlyData: React.PropTypes.func.isRequired,
    panelControls: React.PropTypes.object.isRequired,
    plotlyData: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props);
    console.log(props);
    this._onToggleMapPanel = this._onToggleMapPanel.bind(this);
    let wmsUrl = 'http://hirondelle.crim.ca:8080/ncWMS2/wms';
    // let wmsUrl = 'http://outarde.crim.ca:8083/thredds/wms/birdhouse/flyingpigeon/ncout-d149d317-b67f-11e6-acaf-fa163ee00329.nc';
    // let dataset = 'outputs/data/CMIP5/CCCMA/CanESM2/rcp85/day/atmos/r1i1p1/pr/pr_day_CanESM2_rcp85_r1i1p1_20060101-21001231.nc'
    // let dataset = 'outputs/flyingpigeon/ncout-ffc3a3eb-b7db-11e6-acaf-fa163ee00329.nc';
    let dataset = 'outputs/ouranos/subdaily/aev/shum/aev_shum_1961.nc';
    let mapPanelStatus = {};
    mapPanelStatus[MAP_PANEL] = true;
    mapPanelStatus[MAP_CONTROLS_PANEL] = false;
    mapPanelStatus[CHART_PANEL] = false;
    mapPanelStatus[LAYER_SWITCHER_PANEL] = false;
    mapPanelStatus[TIME_SLIDER_PANEL] = false;
    this.state = {
      mapPanelStatus: mapPanelStatus
    };

    this.props.fetchFacets();
    this.props.openDatasetWmsLayers(dataset);
    this.props.fetchDatasetWMSLayers(wmsUrl, dataset);
    this.props.clickTogglePanel(constants.PANEL_DATASET_DETAILS, false);
    this.props.clickTogglePanel(constants.PANEL_DATASET_WMS_LAYERS, true);
  }

  _onToggleMapPanel (panel) {
    let mapPanelStatus = this.state.mapPanelStatus;
    mapPanelStatus[panel] = !mapPanelStatus[panel];
    this.setState({
      mapPanelStatus: mapPanelStatus
    });
    console.log(panel);
  }

  render () {
    return (
      <div>
        <div className={classes['Visualize']}>
          {(this.state.mapPanelStatus[MAP_PANEL])
            ? <div className={classes.mapContainer}>
              <OLComponent {...this.props} />
            </div> : null
          }
          <PieMenu
            mapPanelStatus={this.state.mapPanelStatus}
            onToggleMapPanel={this._onToggleMapPanel} />
          <div className={classes.left}>
            {(this.state.mapPanelStatus[TIME_SLIDER_PANEL])
              ? <div className={classes.panel}>
                <TimeSlider {...this.props} monthsRange={false} yearsRange={false} />
              </div> : null
            }
            {(this.state.mapPanelStatus[CHART_PANEL])
              ? <div className={classes.panel}>
                <PlotlyWrapper
                  panelControls={this.props.panelControls}
                  data={this.props.plotlyData.data}
                  layout={this.props.plotlyData.layout}
                  fetchPlotlyData={this.props.fetchPlotlyData}
                />
              </div> : null
            }
          </div>
        </div>
      </div>
    );
  }
}
export default Visualize;
