import React from 'react';
import classes from './Visualize.scss';
// TODO: Fix, we should only import containers here
import OLComponent from '../../components/OLComponent';
import DatasetDetails from '../../components/DatasetDetails';
import PlotlyWrapper from '../../components/PlotlyWrapper';
// Containers
import {DatasetWMSLayers, SearchCatalog, ClimateIndicators, MapNavBar} from '../../containers';
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
    this.props.fetchFacets();
  }

  render () {
    return (
      <div>
        <MapNavBar {...this.props} />
        <PlotlyWrapper
          panelControls={this.props.panelControls}
          data={this.props.plotlyData.data}
          layout={this.props.plotlyData.layout}
          fetchPlotlyData={this.props.fetchPlotlyData}
        />
        <div className={classes['Visualize']}>
          <div className={classes.mapContainer}>
            <OLComponent {...this.props} />
          </div>
          <div className={classes.left}>
            <div className={classes.panel}>
              <SearchCatalog {...this.props} />
            </div>
            <div className={classes.panel}>
              <ClimateIndicators {...this.props} />
            </div>
          </div>
          <div className={classes.right}>
            <div className={classes.panel}>
              <DatasetDetails {...this.props} />
            </div>
            <div className={classes.panel}>
              <DatasetWMSLayers {...this.props} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Visualize;
