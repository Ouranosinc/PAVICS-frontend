import React from 'react';
import classes from './Visualize.scss';
// TODO: Fix, we should only import containers here
import OLComponent from '../../components/OLComponent';
import TimeSlider from '../../containers/TimeSlider';
import DatasetDetails from '../../components/DatasetDetails';
import {Monitor} from './../';
// Containers
import {DatasetWMSLayers, SearchCatalog} from '../../containers';
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
    let wmsUrl = 'http://outarde.crim.ca:8084/ncWMS2/wms';
    // let wmsUrl = 'http://outarde.crim.ca:8083/thredds/wms/birdhouse/flyingpigeon/ncout-d149d317-b67f-11e6-acaf-fa163ee00329.nc';
    // let dataset = 'outputs/data/CMIP5/CCCMA/CanESM2/rcp85/day/atmos/r1i1p1/pr/pr_day_CanESM2_rcp85_r1i1p1_20060101-21001231.nc'
    let dataset = 'outputs/flyingpigeon/ncout-ffc3a3eb-b7db-11e6-acaf-fa163ee00329.nc';
    // let dataset = 'outputs/data/ouranos/subdaily/aet/pcp/aet_pcp_1966.nc';

    this.props.fetchFacets();
    this.props.openDatasetWmsLayers(dataset);
    this.props.fetchDatasetWMSLayers(wmsUrl, dataset);
    this.props.clickTogglePanel(constants.PANEL_DATASET_DETAILS, false);
    this.props.clickTogglePanel(constants.PANEL_DATASET_WMS_LAYERS, true);
  }

  render () {
    return (
      <div>
        <div className={classes['Visualize']}>
          <div className={classes.mapContainer}>
            <OLComponent {...this.props} />
          </div>
          <div className={classes.left}>
            <div className={classes.panel}>
              <TimeSlider {...this.props} monthsRange={false} yearsRange={false} />
            </div>
            {/*<div className={classes.panel}>
              <SearchCatalog {...this.props} />
            </div>
            <div className={classes.panel}>
              <Monitor {...this.props} />
            </div>*/}
          </div>
          {/*<div className={classes.right}>
            <div className={classes.panel}>
              <DatasetDetails {...this.props} />
            </div>
            <div className={classes.panel}>
              <DatasetWMSLayers {...this.props} />
            </div>
          </div>*/}
        </div>
      </div>
    );
  }
}
export default Visualize;
