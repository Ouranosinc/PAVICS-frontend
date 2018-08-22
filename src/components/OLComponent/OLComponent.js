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
const INDEX_SHAPEFILE = 10;
const INDEX_SELECTED_REGIONS = 100;
const LAYER_SELECTED_REGIONS = 'LAYER_SELECTED_REGIONS';
const LAYER_REGIONS = 'LAYER_REGIONS';
const LAYER_DATASET = 'LAYER_DATASET';
// not exactly sure if the selected regions index is working
// when base map is at 1 it shadows the selected regions

function datasetHasWmsUrls (dataset) {
  return !!(dataset.wms_url && dataset.wms_url.length > 0);
}

function getMaxPoly (polys) {
  const polyObj = [];
  for (let b = 0; b < polys.length; b++) {
    polyObj.push({ poly: polys[b], area: polys[b].getArea() });
  }
  polyObj.sort(function (a, b) { return a.area - b.area });
  return polyObj[polyObj.length - 1].poly;
}

class OLComponent extends React.Component {
  static propTypes = {
    visualize: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired
  };

  config = {
    polygons: {
      text: 'normal',
      align: 'center',
      baseline: 'middle',
      rotation: 0,
      font: 'inherit',
      weight: 'bold',
      size: '10px',
      offsetX: 0,
      offsetY: 0,
      color: 'blue',
      outline: 'white',
      outlineWidth: 3,
      maxreso: 1200
    }
  };

  constructor (props) {
    super(props);
    this.layers = [];
    this.datasetSource = null;
    this.map = null;
    this.view = null;
    this.state = {
      dialogTitle: '',
      dialogContent: '',
      dialogOpened: false
    };
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.createPolygonStyleFunction = this.createPolygonStyleFunction.bind(this);
    this.createTextStyle = this.createTextStyle.bind(this);
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
  }

  createVectorLayer (nameId) {
    let source = new VectorSource(
      {
        format: new GeoJSON()
      }
    );
    let layer = new VectorLayer(
      {
        source: source,
        style: this.createPolygonStyleFunction(),
        opacity: 1
      }
    );
    layer.set('nameId', nameId);
    return layer;
  }

  handleSelectRegionClick (event) {
    let coordinates = this.map.getCoordinateFromPixel(event.pixel);
    let tl = add(coordinates, [-10e-6, -10e-6]);
    let br = add(coordinates, [10e-6, 10e-6]);
    let minX;
    let maxX;
    if (tl[0] < br[0]) {
      minX = tl[0];
      maxX = br[0];
    } else {
      minX = br[0];
      maxX = tl[0];
    }
    let minY;
    let maxY;
    if (tl[1] < br[1]) {
      minY = tl[1];
      maxY = br[1];
    } else {
      minY = br[1];
      maxY = tl[1];
    }
    let extent = [minX, minY, maxX, maxY];
    let url = __PAVICS_GEOSERVER_PATH__ + '/wfs?service=WFS&' +
      `version=1.1.0&request=GetFeature&typename=${this.props.visualize.selectedShapefile.wmsParams.LAYERS}&` +
      'outputFormat=application/json&srsname=EPSG:3857&' +
      'bbox=' + extent.join(',') + ',EPSG:3857';
    myHttp.get(url)
      .then(response => response.json(), err => console.log(err))
      .then(
        response => {
          console.log('selected regions before click:', this.props.visualize.selectedRegions);
          let id = response.features[0].id;
          if (this.props.visualize.selectedRegions.indexOf(id) !== -1) {
            console.log('removing feature', id);
            this.props.visualizeActions.unselectRegion(id);
            let feature = this.layers[LAYER_SELECTED_REGIONS].getSource().getFeatures().find(elem => elem.f === id);
            this.layers[LAYER_SELECTED_REGIONS].getSource().removeFeature(feature);
          } else {
            console.log('adding feature', id);
            this.props.visualizeActions.selectRegion(id);
            let format = new GeoJSON();
            let features = format.readFeatures(response, {featureProjection: 'EPSG:3857'});
            console.log('adding feature named', features[0].name);
            console.log('received response:', response);
            console.log('received feature:', features);
            this.layers[LAYER_SELECTED_REGIONS].getSource().addFeatures(features);
          }
        },
        err => console.log(err)
      );
  }

  stringDivider (str, lineLength, addedCharacter) {
    let result = '';
    while (str.length > 0) {
      result += str.substring(0, lineLength) + addedCharacter;
      str = str.substring(lineLength);
    }
    return result;
  }

  getText (feature, resolution, dom) {
    let type = dom.text.value;
    let maxResolution = dom.maxreso.value;
    let text = feature['f'];

    if (resolution > maxResolution) {
      text = '';
    } else if (type === 'hide') {
      text = '';
    } else if (type === 'shorten') {
      text = text.trunc(12);
    } else if (type === 'wrap') {
      text = this.stringDivider(text, 16, '\n');
    }
    return text;
  }

  createTextStyle (feature, resolution, dom) {
    let align = dom.align;
    let baseline = dom.baseline;
    let size = dom.size;
    let offsetX = parseInt(dom.offsetX, 10);
    let offsetY = parseInt(dom.offsetY, 10);
    let weight = dom.weight;
    let rotation = parseFloat(dom.rotation);
    let font = weight + ' ' + size + ' ' + dom.font;
    let fillColor = dom.color;
    let outlineColor = dom.outline;
    let outlineWidth = parseInt(dom.outlineWidth, 10);
    return new Text({
      textAlign: align,
      textBaseline: baseline,
      font: font,
      text: this.getText(feature, resolution, dom),
      fill: new Fill({color: fillColor}),
      stroke: new Stroke({color: outlineColor, width: outlineWidth}),
      offsetX: offsetX,
      offsetY: offsetY,
      rotation: rotation
    });
  }

  createPolygonStyleFunction () {
    return (feature, resolution) => {
      // first style is the actual filling of the region
      // second is the label with added hack to work around multi polygons having multiple labels
      return [
        new Style({
          stroke: new Stroke({ color: 'rgba(255,255,255,0.5)' }),
          fill: new Fill({ color: 'rgba(0,255,255,0.5)' })
        }),
        new Style({
          text: this.createTextStyle(feature, resolution, this.config.polygons),
          geometry: feature => {
            if (feature.getGeometry().getType() === 'MultiPolygon') {
              return getMaxPoly(feature.getGeometry().getPolygons()).getInteriorPoint();
            }
            return feature.getGeometry().getInteriorPoint();
          }
        })
      ];
    };
  }

  getScalarValue (event) {
    let coordinates = this.map.getCoordinateFromPixel(event.pixel);
    let converted = transform(coordinates, 'EPSG:3857', 'EPSG:4326');
    console.log('scalar value from coosrindates', converted);
    console.log('selected dataset:', this.props.visualize.currentDisplayedDataset);
    let opendapUrl = this.props.visualize.currentDisplayedDataset['opendap_url'][0];
    let lon = converted[0];
    let lat = converted[1];
    let time = this.props.visualize.currentDateTime.substr(0, this.props.visualize.currentDateTime.length - 5);
    let variable = this.props.visualize.currentDisplayedDataset['variable'];
    this.props.visualizeActions.fetchScalarValue(opendapUrl, lat, lon, time, variable);
  }

  handleMapClick (event) {
    console.log('handling map click:', event);
    switch (this.props.visualize.mapManipulationMode) {
      case constants.VISUALIZE_MODE_REGION_SELECTION:
        if (this.props.visualize.selectedShapefile.title) {
          console.log('selected shapefile:', this.props.visualize.selectedShapefile);
          return this.handleSelectRegionClick(event);
        }
        console.log('choose a shapefile first');
        return;
      case constants.VISUALIZE_MODE_GRID_VALUES:
        if (this.props.visualize.currentDisplayedDataset['dataset_id']) {
          console.log('selected dataset:', this.props.visualize.currentDisplayedDataset);
          return this.getScalarValue(event);
        }
        console.log('choose a dataset first');
        return;
    }
  }

  componentDidMount () {
    this.initMap();
    this.map.addEventListener('click', this.handleMapClick);
    let layer = this.createVectorLayer(LAYER_SELECTED_REGIONS);
    this.map.getLayers().insertAt(INDEX_SELECTED_REGIONS, layer);
    this.layers[LAYER_SELECTED_REGIONS] = layer;
  }

  componentWillUnmount () {
    // TODO: Verify if usefull
    // this.map.setTarget(null)
    // this.map = null//
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.visualize.currentDateTime && nextProps.visualize.currentDateTime !== this.props.visualize.currentDateTime) {
      if (this.datasetSource) {
        this.datasetSource.updateParams(
          {
            TIME: nextProps.visualize.currentDateTime
          }
        );
        console.log('Openlayers time changed ' + nextProps.visualize.currentDateTime);
        this.datasetSource.setTileLoadFunction(this.datasetSource.getTileLoadFunction());
        this.datasetSource.changed();
      }
    }
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
  this depends on the previous props because of the way we keep track of the ol layers
  they are stored as a "map" built from their title
   */
  setShapefile (prevProps) {
    let shapefile = this.props.visualize.selectedShapefile;
    console.log('change shapefile:', shapefile);
    this.layers[LAYER_SELECTED_REGIONS].getSource().clear();
    this.map.removeLayer(this.layers[LAYER_REGIONS]);
    let source = new TileWMS(
      {
        url: shapefile.wmsUrl,
        params: shapefile.wmsParams
      }
    );
    this.addTileWMSLayer(
      INDEX_SHAPEFILE,
      LAYER_REGIONS,
      source,
      0.4
    );
  }

  findDimension (dimensions, dimensionName) {
    for (let i = 0; i < dimensions.length; i++) {
      if (dimensions[i]['name'] === dimensionName) {
        return dimensions[i];
      }
    }
  }

  /*
  routine creates a wms layer and adds it to the map layer repositories
   */
  setDatasetLayer (minMaxBracket, layerName, resourceUrl, opacity, colorPalette) {
    const wmsParams = {
      'COLORSCALERANGE': minMaxBracket,
      'ABOVEMAXCOLOR': 'extend',
      'TRANSPARENT': 'TRUE',
      'STYLES': colorPalette,
      'LAYERS': layerName,
      'EPSG': '4326',
      'LOGSCALE': false,
      'crossOrigin': 'anonymous',
      'BGCOLOR': 'transparent',
      'SRS': 'EPSG:4326',
      'TIME': ''
    };
    this.map.removeLayer(this.layers[LAYER_DATASET]);
    this.datasetSource = new TileWMS({
      url: resourceUrl,
      params: wmsParams
    });
    this.addTileWMSLayer(INDEX_DATASET_LAYER, LAYER_DATASET, this.datasetSource, opacity);
  }

  /*
  routine fetches capabilities from a wms url, then creates a layer from it
  it expects the dataset to have informations about its wms_urls
  at this point in time, the informations stored in the dataset are assumed to be valid

  TODO we refetch the capabilities every time we make a modification to the dataset, but this is inefficient
  we could only fetch these when we change dataset, no need to reload only if we change the min max or opacity
   */
  updateDatasetWmsLayer (dataset) {
    console.log('setting new dataset layer', dataset);
    const currentWmsCapabilitiesUrl = dataset.wms_url[dataset.currentFileIndex];
    NotificationManager.info(`Dataset is being loaded on the map, it may take a few seconds...`, 'Information', 3000);

    if(currentWmsCapabilitiesUrl && currentWmsCapabilitiesUrl.length) {
      myHttp.get(currentWmsCapabilitiesUrl)
        .then(response => {
          if(response.status === 200) {
            return response.text();
          } else {
            // Typically: 401 Unauthorized
            throw new Error(`${response.status} ${response.statusText}`)
          }
        })
        .then(text => {
          const parser = new WMSCapabilities();
          let capabilities = "";
          try {
            capabilities = parser.read(text);
            console.log('fetched capabilities %o for wms url %s', capabilities, currentWmsCapabilitiesUrl);
          } catch(err){
            // The server might still return a code 200 containing an error
            // Might be an Apache error returning HTML containing H1 tag, Else just return everything
            let h1 = '';
            text.replace(/<h1>(.*?)<\/h1>/g, (match, g1) => h1 = g1);
            throw new Error((h1.length)? h1: text)
          }
          const index = currentWmsCapabilitiesUrl.indexOf('?');
          if(index < 0) {
            throw new Error('Could not find exact WMS Server URL needed for following GetMetadata requests');
          }
          const wmsServerUrl = currentWmsCapabilitiesUrl.substring(0, index);
          // We cannot trust anymore what's returned by GetCapabilities: capabilities['Service']['OnlineResource'];

          /*
           here we assume that the layer that actually contains the information we want to display is the first one of the dataset
           for instance, there could be layers containing lat or lon in the return values of the capabilities
           hopefully the relevant variable will always be the first one
           */
          const layer = capabilities['Capability']['Layer']['Layer'][0]['Layer'][0];
          const layerName = layer['Name'];
          const minMaxBracket = `${dataset['variable_min']},${dataset['variable_max']}`;
          console.log('current dataset min max bracket: %s', minMaxBracket);
          this.setDatasetLayer(minMaxBracket, layerName, wmsServerUrl, dataset.opacity, `default-scalar/${dataset.variable_palette}`);

          if (layer['Dimension']) {
            const timeDimension = this.findDimension(layer['Dimension'], 'time');
            const date = timeDimension.values.substring(0, 24);
            this.props.visualizeActions.fetchWMSLayerTimesteps(wmsServerUrl, layerName, date);
            // this.props.visualizeActions.setCurrentDateTime(date);
          }

          this.props.visualizeActions.setSelectedDatasetCapabilities(capabilities);
          this.props.visualizeActions.fetchWMSLayerDetails(wmsServerUrl, layerName);
          // Normally fetched entirely by OpenLayers, but we want to an error when returning an error: ex. 401 Unauthorized
          this.props.visualizeActions.testWMSGetMapPermission(wmsServerUrl, layerName);
        })
        .catch(err => {
          console.log(err);
          NotificationManager.error(`Method GetCapabilities failed at being fetched from the NcWMS2 server: ${err}`, 'Error', 10000);
        });
    }
  }

  updateColorPalette () {
    // TODO there is something that feels somewhat wrong about having the datasetLayer in a prop
    // it might be totally ok, but be bit careful ot
    if (this.layers[LAYER_DATASET]) {
      console.log('changing color palette:', this.props.visualize.selectedColorPalette);
      this.datasetSource.updateParams({
        'STYLES': `default-scalar/${this.props.visualize.selectedColorPalette}`
      });
    } else {
      console.log('select a dataset first');
    }
  }

  /*
  OpenLayers inner workings are somewhat obfuscated. The layer object only has one or two letter properties that don't really express what they're for
  Here I assume that for open layers to display something, it needs this "H" property, that contains opacity, layer title, it's visibility, and a few other things
  This is a bit critical, as it decides wether or not the app considers that there is a displayed dataset
   */
  hasCurrentlyDisplayedDataset () {
    return !!(this.layers[LAYER_DATASET] && this.layers[LAYER_DATASET].H);
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
    if (this.props.visualize.selectedColorPalette !== prevProps.visualize.selectedColorPalette) {
      this.updateColorPalette();
    }
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
    if (this.props.visualize.selectedShapefile !== prevProps.visualize.selectedShapefile) {
      this.setShapefile(prevProps);
    }
    const newDataset = this.props.visualize.currentDisplayedDataset;
    const oldDataset = prevProps.visualize.currentDisplayedDataset;
    const hasDisplayedDataset = this.hasCurrentlyDisplayedDataset();
    console.log('current displayed dataset: %o, this should be a boolean indicating it exists: %o', this.layers[LAYER_DATASET], hasDisplayedDataset);

    // if there is a displayed dataset and the new one can't be shown on the map (ie having wmsUrls), remove the layer
    if ( hasDisplayedDataset && !datasetHasWmsUrls(newDataset) ) {
      this.removeLayer(LAYER_DATASET);
      return;
    }

    // If new data can be shown on the map (ie having wmsUrls), verify something has really changed
    if(datasetHasWmsUrls(newDataset)) {
      // if the opacity has changed, just change opacity
      if ( newDataset.opacity !== oldDataset.opacity ) {
        this.layers[LAYER_DATASET].setOpacity(newDataset.opacity);
      }

      /*
       We want to update the selected dataset when
       - there is actually a change of the selected dataset (dataset_id/uniqueLayerSwitcherId
       - the time has changed so much that a new file is needed (currentFileIndex changed)
       - FIXME: when the min/max has changed
       */
      if ( (newDataset.currentFileIndex !== oldDataset.currentFileIndex) ) {
        // if the new dataset currentFileIndex has changed, reload the layer
        console.log('currentFileIndex has changed and we update the wms layer. new: %s, old: %s', newDataset.currentFileIndex, oldDataset.currentFileIndex);
        this.updateDatasetWmsLayer(newDataset);
      } else if ( (newDataset['dataset_id'] !== oldDataset['dataset_id'])) {
        // if the dataset_id has changed, reload the layer
        console.log('dataset id has changed and we update the wms layer. new: %s, old: %s', newDataset['dataset_id'], oldDataset['dataset_id']);
        this.updateDatasetWmsLayer(newDataset);
      } else if((newDataset['uniqueLayerSwitcherId'] !== oldDataset['uniqueLayerSwitcherId'])) {
        // Could be the same dataset_id but different files in the layer switcher
        // We could compare newDataset.fileserver_url[newDataset.currentFileIndex] and oldDataset.fileserver_url[oldDataset.currentFileIndex]
        console.log('uniqueLayerSwitcherId has changed and we update the wms layer. new: %s, old: %s', newDataset['uniqueLayerSwitcherId'], oldDataset['uniqueLayerSwitcherId']);
        this.updateDatasetWmsLayer(newDataset);
      } else if ( newDataset['variable_min'] !== oldDataset['variable_min'] || newDataset['variable_max'] !== oldDataset['variable_max']) {
        // if min max values have changed, reload the layer
        // FIXME: Shouldn't have to recall GetCapabilities()  when min/max changes
        console.log('min max values have changed so we reload the dataset');
        this.updateDatasetWmsLayer(newDataset);
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
