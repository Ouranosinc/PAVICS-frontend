import React from 'react';
import PropTypes from 'prop-types';

// OpenLayers 5
import Map from 'ol/Map';
import View from 'ol/View';
import MousePosition from 'ol/control/MousePosition';
import { defaults as ControlDefaults, ScaleLine, ZoomSlider } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import BingMaps from 'ol/source/BingMaps';
import OSM from 'ol/source/OSM';
import { GeoJSON, WMSCapabilities } from 'ol/format';
import { Fill, Text, Stroke, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';
import { add, createStringXY } from 'ol/coordinate';
import { transform } from 'ol/proj';

import OLDatasetRenderer from './../../containers/OLDatasetRenderer';
import OLRegionsRenderer from './../../containers/OLRegionsRenderer';
import OLRegionsSelector from './../../containers/OLRegionsSelector';
import OLDrawFeatures from './../../containers/OLDrawFeatures';
// Cesium
import Cesium from 'cesium/Cesium';
window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
require('cesium/Widgets/widgets.css');
import OLCesium from 'ol-cesium';

import classes from './OLComponent.scss';
import Dialog from'@material-ui/core/Dialog';
import DialogContent from'@material-ui/core/DialogContent';
import DialogTitle from'@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import * as constants from './../../constants';
import myHttp from '../../util/http';
import { NotificationManager } from 'react-notifications';

// Couldn't figure out the bug when importing inner component css file but it works from node_modules
let G_BING_API_KEY = 'AtXX65CBBfZXBxm6oMyf_5idMAMI7W6a5GuZ5acVcrYi6lCQayiiBz7_aMHB7JR7';
const INDEX_BASE_MAP = -10;
const INDEX_DATASET_LAYER = 1;
const INDEX_REGIONS = 10;
const INDEX_SELECTED_REGIONS = 100;
const LAYER_SELECTED_REGIONS = 'LAYER_SELECTED_REGIONS';
const LAYER_REGIONS = 'LAYER_REGIONS';
const LAYER_DATASET = 'LAYER_DATASET';
// not exactly sure if the selected regions index is working
// when base map is at 1 it shadows the selected regions

const MapContext = React.createContext({
  map: null,
});

class OLComponent extends React.Component {
  static propTypes = {
    visualize: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.layers = [];
    this.map = null;
    this.view = null;
    this.state = {
      dialogTitle: '',
      dialogContent: '',
      dialogOpened: false
    };
    this.handleClose = this.handleClose.bind(this);
  }

  addTileWMSLayer (position, title, source, opacity, extent, visible = true) {
    let layer = new TileLayer(
      {
        visible: visible,
        title: title,
        opacity: opacity,
        source: source,
        extent: extent
      }
    );
    layer.set('nameId', title);
    this.layers[title] = layer;
    this.map.getLayers().insertAt(position, layer);
    console.log('addTileWMSLayer:', layer);
  }

  addCesiumTileLayer(title) {
    let layer = new TileLayer({
      source: new OSM()
    });
    this.map.getLayers().insertAt(INDEX_BASE_MAP, layer);
    layer.set('nameId', title);
    this.layers[title] = layer;
  }

  addBingLayer (title, bingStyle) {
    let layer = new TileLayer(
      {
        visible: true,
        preload: Infinity,
        source: new BingMaps(
          {
            key: G_BING_API_KEY,
            imagerySet: bingStyle
            // use maxZoom 19 to see stretched tiles instead of the BingMaps
            // "no photos at this zoom level" tiles
            // maxZoom: 19
          }
        )
      }
    );
    this.map.getLayers().insertAt(INDEX_BASE_MAP, layer);
    layer.set('nameId', title);
    this.layers[title] = layer;

  }

  getLayer (title) {
    if (this.layers[title] !== undefined) {
      return this.layers[title];
    }
    return null;
  }

  initMap () {
    let minZoom = 2;
    let maxZoom = 20/*13*/;

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
        layers: [
          /*new VectorLayer({
            source: vectorSource
          })*/
          /*new TileLayer({
            source: new OSM()
          })*/
        ],
        target: 'map',
        renderer: 'canvas',
        view: this.view
      }
    );
    this.map.addControl(new ScaleLine());
    window.cyCurrentMap = this.map;
    this.ol3d = new OLCesium({map: this.map});
    this.ol3d.setEnabled(false);

    let mousePosition = new MousePosition({
      coordinateFormat: createStringXY(6),
      projection: 'EPSG:4326',
      target: document.getElementById('mouseCoordinates')
    });
    // let zoomSlider = new ol.control.ZoomSlider();
    this.map.addControl(mousePosition);
    // this.map.addControl(zoomSlider);

    // this.bboxSelector.current.initBBoxRegionSelector(this.map, this.layers[LAYER_REGIONS], this.layers[LAYER_SELECTED_REGIONS]);
    // this.bboxSelector.current.initBBoxSelector(this.map);
  }

  stringDivider (str, lineLength, addedCharacter) {
    let result = '';
    while (str.length > 0) {
      result += str.substring(0, lineLength) + addedCharacter;
      str = str.substring(lineLength);
    }
    return result;
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

  removeBasemap(prevProps) {
    console.log('remove base map:', this.props.visualize.selectedBasemap);
    let layer = this.getLayer(prevProps.visualize.selectedBasemap);
    this.map.removeLayer(layer);
  }

  setBasemap (prevProps) {
    this.removeBasemap(prevProps)
    this.addBingLayer(this.props.visualize.selectedBasemap, this.props.visualize.selectedBasemap);
  }

  /*
  the open layers map and our internal layer repository are two different things
  ol map is what is being displayed, layer repository is how we keep track of what is displayed and manage changes
   */
  removeLayer (layer) {
    this.map.removeLayer(this.layers[layer]);
    delete this.layers[layer];
  }

  componentDidUpdate (prevProps, prevState) {
    console.log('OLComponent did update. prev props: %o vs current props: %o. prev state: %o vs current state: %o.', prevProps, this.props, prevState, this.state);
    if (this.props.visualize.selectedBasemap !== prevProps.visualize.selectedBasemap) {
      if(this.props.visualize.selectedBasemap === 'Cesium') {
        this.removeBasemap(prevProps);
        this.addCesiumTileLayer(this.props.visualize.selectedBasemap);
        let scene = this.ol3d.getCesiumScene();
        scene.terrainProvider = Cesium.createWorldTerrain();
        this.ol3d.setEnabled(true);
      } else {
        this.ol3d.setEnabled(false);
        this.setBasemap(prevProps);
      }
    }
  }

  handleClose () {
    this.setState(
      {
        ...this.state,
        dialogContent: '',
        dialogOpened: false
      }
    );
  }

  render () {
    return (
      <div className={classes['OLComponent']}>
        <div id="map" className="map" style={{'width': '100%', 'height': '100%', 'position': 'fixed'}}>
          <div id="popup" className="ol-popup"></div>
          <OLDatasetRenderer layerName={LAYER_DATASET} layerIndex={INDEX_DATASET_LAYER} map={this.map} />
          <OLDrawFeatures map={this.map} />
          <OLRegionsRenderer layerName={LAYER_REGIONS} layerIndex={INDEX_REGIONS} map={this.map} />
          <OLRegionsSelector layerName={LAYER_SELECTED_REGIONS} layerIndex={INDEX_SELECTED_REGIONS} map={this.map} />
        </div>
        <Dialog
          onClose={this.handleClose}
          open={this.state.dialogOpened}>
          <DialogTitle>
            {this.state.dialogTitle}
          </DialogTitle>
          <DialogContent>
            <Typography>
              {this.state.dialogContent}
            </Typography>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default OLComponent;
