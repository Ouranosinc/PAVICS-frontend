import React from 'react'
import {connect} from 'react-redux'
import classes from './MapViewer.scss'

//TODO: Fix, we should only import containers here



import MapViewPanel from '../../../components/MapViewPanel'

//Containers
//import {DatasetWMSLayers, SearchCatalog, ClimateIndicators} from '../../../containers'

import {
  //Panels
  clickTogglePanel,

} from '../modules/MapViewer'

var me;

class MapViewer extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    console.log(props);
    this.lastKey = 0;
    this.lastValue = 0;
    me = this;
  }

  render() {
    return (
      <div className={classes['MapViewer']}>
        <div className={classes.mapContainer}>
          <MapViewPanel {...this.props }/>
        </div>
      </div>
    )
  }
}

const mapViewerActionCreators = {
  //Panels
  clickTogglePanel,

};

const mapViewerStateToProps = (state) => ({
  currentSelectedKey: state.mapviewer.currentSelectedKey,
  currentZoom: state.mapviewer.currentZoom
});

export default connect(mapViewerStateToProps, mapViewerActionCreators)(MapViewer)
