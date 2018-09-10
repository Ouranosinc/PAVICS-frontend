import React from 'react';
import PropTypes from 'prop-types';
import classes from './OLComponent.scss';

// OpenLayers 5
import Map from 'ol/Map';
import View from 'ol/View';
import MousePosition from 'ol/control/MousePosition';
import { defaults as ControlDefaults, ScaleLine, ZoomSlider } from 'ol/control';
import { createStringXY } from 'ol/coordinate';

import OLBasemapRenderer from './../../containers/OLBasemapRenderer';
import OLDatasetRenderer from './../../containers/OLDatasetRenderer';
import OLRegionsRenderer from './../../containers/OLRegionsRenderer';
import OLRegionsSelector from './../../containers/OLRegionsSelector';
import OLDrawFeatures from './../../containers/OLDrawFeatures';


const INDEX_BASE_MAP = -10;
const INDEX_DATASET_LAYER = 1;
const INDEX_REGIONS = 10;
const INDEX_SELECTED_REGIONS = 100;
const LAYER_SELECTED_REGIONS = 'LAYER_SELECTED_REGIONS';
const LAYER_REGIONS = 'LAYER_REGIONS';
const LAYER_DATASET = 'LAYER_DATASET';
// not exactly sure if the selected regions index is working
// when base map is at 1 it shadows the selected regions

class OLComponent extends React.Component {
  static propTypes = {
    visualize: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.map = null;
    this.view = null;
  }

  initMap () {
    let minZoom = 2;
    let maxZoom = 19/*13*/;

    this.view = new View(
      {
        center: [-10997148, 8569099],
        zoom: 4,
        minZoom: minZoom,
        maxZoom: maxZoom
      }
    );
    /*let panZoom = new ol.control.PanZoom({
      imgPath: 'lib/ol3-panzoom/zoombar_black',
      minZoom: minZoom,
      maxZoom: maxZoom,
      slider: true
    });*/

    this.map = new Map(
      {
        layers: [],
        target: 'map',
        renderer: 'canvas',
        view: this.view
      }
    );
    this.map.addControl(new ScaleLine());
    window.cyCurrentMap = this.map;

    let mousePosition = new MousePosition({
      coordinateFormat: createStringXY(6),
      projection: 'EPSG:4326',
      target: document.getElementById('mouseCoordinates')
    });
    // let zoomSlider = new ol.control.ZoomSlider();
    this.map.addControl(mousePosition);
    // this.map.addControl(zoomSlider);
  }

  /*getScalarValue (event) {
    let coordinates = this.map.getCoordinateFromPixel(event.pixel);
    let converted = transform(coordinates, 'EPSG:3857', 'EPSG:4326');
    console.log('scalar value from coosrindates', converted);
    console.log('selected dataset:', this.props.layerDataset.currentDisplayedDataset);
    const opendapUrl = this.props.layerDataset.currentDisplayedDataset['opendap_url'][0];
    const lon = converted[0];
    const lat = converted[1];
    const time = this.props.layerDataset.currentDateTime.substr(0, this.props.layerDataset.currentDateTime.length - 5);
    const variable = this.props.layerDataset.currentDisplayedDataset['variable'];
    this.props.visualizeActions.fetchScalarValue(opendapUrl, lat, lon, time, variable);
  }*/

  componentDidMount () {
    this.initMap();
  }

  render () {
    return (
      <div className={classes['OLComponent']}>
        <div id="map" className="map" style={{'width': '100%', 'height': '100%', 'position': 'fixed'}}>
          <div id="popup" className="ol-popup"></div>
          <OLBasemapRenderer map={this.map} layerIndex={INDEX_BASE_MAP} />
          <OLDatasetRenderer map={this.map} layerName={LAYER_DATASET} layerIndex={INDEX_DATASET_LAYER} />
          <OLDrawFeatures map={this.map} />
          <OLRegionsRenderer map={this.map} layerName={LAYER_REGIONS} layerIndex={INDEX_REGIONS} />
          <OLRegionsSelector map={this.map} layerName={LAYER_SELECTED_REGIONS} layerIndex={INDEX_SELECTED_REGIONS} />
        </div>
      </div>
    );
  }
}

export default OLComponent;
