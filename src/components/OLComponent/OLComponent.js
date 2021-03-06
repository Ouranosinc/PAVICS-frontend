import React from 'react';
import classes from './OLComponent.scss';
import Map from 'ol/Map';
import View from 'ol/View';
import OLBasemapRenderer from './../../containers/OLBasemapRenderer';
import OLDatasetClickSelector from './../../containers/OLDatasetClickSelector';
import OLDatasetRenderer from './../../containers/OLDatasetRenderer';
import OLDrawFeatures from './../../containers/OLDrawFeatures';
import OLRegionsRenderer from './../../containers/OLRegionsRenderer';
import OLRegionsSelector from './../../containers/OLRegionsSelector';
import OLMouseCoordinates from './../../containers/OLMouseCoordinates';
import OLScaleLine from './../../containers/OLScaleLine';
import OLZoomSlider from './../../containers/OLZoomSlider';

// not exactly sure if the selected regions index is working
// when base map is at 1 it shadows the selected regions
const Z_INDEX_BASE_MAP = -10;
const Z_INDEX_DATASET_LAYER = 1;
const Z_INDEX_REGIONS = 10;
const Z_INDEX_SELECTED_REGIONS = 100;
const Z_INDEX_DRAWN_FEATURES = 101;
const LAYER_SELECTED_REGIONS = 'LAYER_SELECTED_REGIONS';
const LAYER_REGIONS = 'LAYER_REGIONS';
const LAYER_DATASET = 'LAYER_DATASET';
const LAYER_DRAWN_FEATURES = 'LAYER_DRAWN_FEATURES';
const MIN_ZOOM = 2;
const MAX_ZOOM = 13;

class OLComponent extends React.Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.map = null;
    this.view = null;
  }

  initMap () {
    this.view = new View({
      center: [-10997148, 8569099],
      zoom: 4,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM
    });

    this.map = new Map({
      layers: [],
      target: 'map',
      renderer: 'canvas',
      view: this.view
    });

    // Cypress needs a global cyCurrentMap for some tests
    window.cyCurrentMap = this.map;
  }

  componentDidMount () {
    this.initMap();
  }

  render () {
    return (
      <div className={classes['OLComponent']}>
        <div id="map" className="map" style={{'width': '100%', 'height': '100%', 'position': 'fixed'}}>
          <div id="popup" className="ol-popup"></div>
          <OLBasemapRenderer map={this.map} layerZIndex={Z_INDEX_BASE_MAP} />
          <OLDatasetRenderer map={this.map} layerName={LAYER_DATASET} layerZIndex={Z_INDEX_DATASET_LAYER} />
          <OLDrawFeatures map={this.map} layerName={LAYER_DRAWN_FEATURES} layerZIndex={Z_INDEX_DRAWN_FEATURES} />
          <OLRegionsRenderer map={this.map} layerName={LAYER_REGIONS} layerZIndex={Z_INDEX_REGIONS} />
          <OLRegionsSelector map={this.map} layerName={LAYER_SELECTED_REGIONS} layerZIndex={Z_INDEX_SELECTED_REGIONS} />
          <OLMouseCoordinates map={this.map} />
          <OLScaleLine map={this.map} />
          <OLZoomSlider map={this.map} />
          <OLDatasetClickSelector map={this.map} />
        </div>
      </div>
    );
  }
}

export default OLComponent;
