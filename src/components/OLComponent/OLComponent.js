import React from 'react';
import classes from './OLComponent.scss';
// import ol from 'openlayers';
import Dialog from 'material-ui/Dialog';
import * as constants from './../../constants';
import myHttp from './../../../lib/http';
// Of course any ol3 widget (ol3-layerswitcher, ol3-panzoom) needs ol as global (...)
// window.ol = ol;
// require('./../../lib/ol3-panzoom/ol3pz');

// Couldn't figure out the bug when importing inner component css file but it works from node_modules
let G_BING_API_KEY = 'AtXX65CBBfZXBxm6oMyf_5idMAMI7W6a5GuZ5acVcrYi6lCQayiiBz7_aMHB7JR7';
const INDEX_BASE_MAP = -10;
const INDEX_DATASET_LAYER = 1;
const INDEX_SHAPEFILE = 10;
const INDEX_SELECTED_REGIONS = 100;
const LAYER_SELECTED_REGIONS = 'selectedRegions';
const LAYER_DATASET = 'dataset_layer';
// not exactly sure if the selected regions index is working
// when base map is at 1 it shadows the selected regions

function datasetHasWmsUrls (dataset) {
  return !!(dataset.wms_url && dataset.wms_url.length > 0);
}

class OLComponent extends React.Component {
  static propTypes = {
    currentDateTime: React.PropTypes.string.isRequired,
    mapManipulationMode: React.PropTypes.string.isRequired,
    setCurrentDateTime: React.PropTypes.func.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    selectedColorPalette: React.PropTypes.string.isRequired,
    currentDisplayedDataset: React.PropTypes.object.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedBasemap: React.PropTypes.string.isRequired,
    selectedDatasetCapabilities: React.PropTypes.object.isRequired,
    setSelectedDatasetCapabilities: React.PropTypes.func.isRequired,
    selectRegion: React.PropTypes.func.isRequired,
    unselectRegion: React.PropTypes.func.isRequired,
    capabilities: React.PropTypes.object,
    dataset: React.PropTypes.object,
    layer: React.PropTypes.object.isRequired,
    fetchWMSLayerDetails: React.PropTypes.func.isRequired,
    fetchWMSLayerTimesteps: React.PropTypes.func.isRequired,
    fetchPlotlyData: React.PropTypes.func.isRequired,
    fetchScalarValue: React.PropTypes.func.isRequired
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
    let layer = new ol.layer.Tile(
      {
        visible: visible,
        title: title,
        opacity: opacity,
        source: source,
        extent: extent
      }
    );
    this.layers[title] = layer;
    this.map.getLayers().insertAt(position, layer);
    console.log('addTileWMSLayer:', layer);
  }

  addBingLayer (title, bingStyle) {
    let layer = new ol.layer.Tile(
      {
        visible: true,
        preload: Infinity,
        source: new ol.source.BingMaps(
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
    let maxZoom = 13;

    this.view = new ol.View(
      {
        center: [-10997148, 8569099],
        zoom: 4,
        minZoom: minZoom,
        maxZoom: maxZoom
      }
    );
    var scaleLineControl = new ol.control.ScaleLine();
    let panZoom = new ol.control.PanZoom({
      imgPath: 'ol3-panzoom/zoombar_black',
      minZoom: minZoom,
      maxZoom: maxZoom,
      slider: true
    });
    this.map = new ol.Map(
      {
        controls: ol.control.defaults({
          zoom: false
        }).extend([
          scaleLineControl,
          panZoom
        ]),
        layers: [],
        target: 'map',
        renderer: 'canvas',
        view: this.view
      }
    );

    let mousePosition = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(6),
      projection: 'EPSG:4326',
      target: document.getElementById('mouseCoordinates')
    });
    // let zoomSlider = new ol.control.ZoomSlider();
    this.map.addControl(mousePosition);
    // this.map.addControl(zoomSlider);
  }

  createVectorLayer (nameId) {
    let source = new ol.source.Vector(
      {
        format: new ol.format.GeoJSON()
      }
    );
    let layer = new ol.layer.Vector(
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
    let tl = ol.coordinate.add(coordinates, [-10e-6, -10e-6]);
    let br = ol.coordinate.add(coordinates, [10e-6, 10e-6]);
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
      `version=1.1.0&request=GetFeature&typename=${this.props.selectedShapefile.wmsParams.LAYERS}&` +
      'outputFormat=application/json&srsname=EPSG:3857&' +
      'bbox=' + extent.join(',') + ',EPSG:3857';
    myHttp.get(url)
      .then(response => response.json(), err => console.log(err))
      .then(
        response => {
          console.log('selected regions before click:', this.props.selectedRegions);
          let id = response.features[0].id;
          if (this.props.selectedRegions.indexOf(id) !== -1) {
            console.log('removing feature', id);
            this.props.unselectRegion(id);
            let feature = this.layers[LAYER_SELECTED_REGIONS].getSource().getFeatures().find(elem => elem.f === id);
            this.layers[LAYER_SELECTED_REGIONS].getSource().removeFeature(feature);
          } else {
            console.log('adding feature', id);
            this.props.selectRegion(id);
            let format = new ol.format.GeoJSON();
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
    return new ol.style.Text({
      textAlign: align,
      textBaseline: baseline,
      font: font,
      text: this.getText(feature, resolution, dom),
      fill: new ol.style.Fill({color: fillColor}),
      stroke: new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
      offsetX: offsetX,
      offsetY: offsetY,
      rotation: rotation
    });
  }

  createPolygonStyleFunction () {
    return (feature, resolution) => {
      let fill = new ol.style.Fill(
        {
          color: 'rgba(0,255,255,0.5)'
        }
      );
      let stroke = new ol.style.Stroke(
        {
          color: 'rgba(255,255,255,0.5)'
        }
      );
      let style = new ol.style.Style({
        stroke: stroke,
        fill: fill,
        text: this.createTextStyle(feature, resolution, this.config.polygons)
      });
      return [style];
    };
  }

  getScalarValue (event) {
    let coordinates = this.map.getCoordinateFromPixel(event.pixel);
    let converted = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
    console.log('scalar value from coosrindates', converted);
    console.log('selected dataset:', this.props.currentDisplayedDataset);
    let opendapUrl = this.props.currentDisplayedDataset['opendap_url'][0];
    let lon = converted[0];
    let lat = converted[1];
    let time = this.props.currentDateTime.substr(0, this.props.currentDateTime.length - 5);
    let variable = this.props.currentDisplayedDataset['variable'];
    this.props.fetchScalarValue(opendapUrl, lat, lon, time, variable);
  }

  handleMapClick (event) {
    console.log('handling map click:', event);
    switch (this.props.mapManipulationMode) {
      case constants.VISUALIZE_MODE_JOB_MANAGEMENT:
        if (this.props.selectedShapefile.title) {
          console.log('selected shapefile:', this.props.selectedShapefile);
          return this.handleSelectRegionClick(event);
        }
        console.log('choose a shapefile first');
        return;
      case constants.VISUALIZE_MODE_VISUALIZE:
        if (this.props.currentDisplayedDataset['dataset_id']) {
          console.log('selected dataset:', this.props.currentDisplayedDataset);
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
    if (nextProps.currentDateTime && nextProps.currentDateTime !== this.props.currentDateTime) {
      if (this.datasetSource) {
        this.datasetSource.updateParams(
          {
            TIME: nextProps.currentDateTime
          }
        );
        console.log('Openlayers time changed ' + nextProps.currentDateTime);
        this.datasetSource.setTileLoadFunction(this.datasetSource.getTileLoadFunction());
        this.datasetSource.changed();
      }
    }
  }

  setBasemap (prevProps) {
    console.log('change base map:', this.props.selectedBasemap);
    let layer = this.getLayer(prevProps.selectedBasemap);
    this.map.removeLayer(layer);
    this.addBingLayer(this.props.selectedBasemap, this.props.selectedBasemap);
  }

  /*
  this depends on the previous props because of the way we keep track of the ol layers
  they are stored as a "map" built from their title
   */
  setShapefile (prevProps) {
    let shapefile = this.props.selectedShapefile;
    console.log('change shapefile:', shapefile);
    this.layers[LAYER_SELECTED_REGIONS].getSource().clear();
    this.map.removeLayer(this.layers[prevProps.selectedShapefile.title]);
    let source = new ol.source.TileWMS(
      {
        url: shapefile.wmsUrl,
        params: shapefile.wmsParams
      }
    );
    this.addTileWMSLayer(
      INDEX_SHAPEFILE,
      shapefile.title,
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
    this.datasetSource = new ol.source.TileWMS({
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
    myHttp.get(currentWmsCapabilitiesUrl)
      .then(response => response.text())
      .then(text => {
        const parser = new ol.format.WMSCapabilities();
        const capabilities = parser.read(text);
        const resourceUrl = capabilities['Service']['OnlineResource'];
        console.log('fetched capabilities %o for wms url %s', capabilities, currentWmsCapabilitiesUrl);

        /*
        here we assume that the layer that actually contains the information we want to display is the first one of the dataset
        for instance, there could be layers containing lat or lon in the return values of the capabilities
        hopefully the relevant variable will always be the first one
         */
        const layer = capabilities['Capability']['Layer']['Layer'][0]['Layer'][0];
        const layerName = layer['Name'];
        const minMaxBracket = `${dataset['variable_min']},${dataset['variable_max']}`;
        console.log('current dataset min max bracket: %s', minMaxBracket);
        this.setDatasetLayer(minMaxBracket, layerName, resourceUrl, dataset.opacity, `default-scalar/${dataset.variable_palette}`);

        if (layer['Dimension']) {
          const timeDimension = this.findDimension(layer['Dimension'], 'time');
          const date = timeDimension.values.substring(0, 24);
          this.props.fetchWMSLayerTimesteps(resourceUrl, layerName, date);
          // this.props.setCurrentDateTime(date);
        }

        this.props.setSelectedDatasetCapabilities(capabilities);
        this.props.fetchWMSLayerDetails(resourceUrl, layerName);
      })
      .catch(err => console.log(err));
  }

  updateColorPalette () {
    // TODO there is something that feels somewhat wrong about having the datasetLayer in a prop
    // it might be totally ok, but be bit careful ot
    if (this.layers[LAYER_DATASET]) {
      console.log('changing color palette:', this.props.selectedColorPalette);
      this.datasetSource.updateParams({
        'STYLES': `default-scalar/${this.props.selectedColorPalette}`
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
    if (this.props.selectedColorPalette !== prevProps.selectedColorPalette) {
      this.updateColorPalette();
    }
    if (this.props.selectedBasemap !== prevProps.selectedBasemap) {
      this.setBasemap(prevProps);
    }
    if (this.props.selectedShapefile !== prevProps.selectedShapefile) {
      this.setShapefile(prevProps);
    }
    /*
    what is a selected dataset really?
    the currentDisplayedDataset from the store always contains a few properties even if no dataset is actually selected
    at the very least, if we want to _display_ something we need wms capabilities urls
    we also have a list of layers contained in this.layers, having a selected dataset could be the presence of a layer in this.layers[LAYER_DATASET]
    I think we will need both the presence of a layer in this.layers as well as the existence of at least one wms url the different state changes

    we want to update the selected dataset when
     - there is actually a change of the selected dataset
     - the time has changed (actually meaning that the current file index has been changed) and we need to reload the layer
     - the opacity changes (which does not require a full reload)
     - we reset the dataset (remove it completely)
     */
    const newDataset = this.props.currentDisplayedDataset;
    const oldDataset = prevProps.currentDisplayedDataset;
    const hasDisplayedDataset = this.hasCurrentlyDisplayedDataset();
    console.log('current displayed dataset: %o, this should be a boolean indicating it exists: %o', this.layers[LAYER_DATASET], hasDisplayedDataset);

    // if there is a displayed dataset
    if ( hasDisplayedDataset ) {
      // if the new dataset doesn't have wmsUrls, we want to destroy the layer
      // after we have made this check, we need to return because the other conditions could be true
      // this slight logical flaw is within the acceptable I believe, either of the properties that are checked could be "undefined"
      // which would give a false positive on the change of said property
      if ( !datasetHasWmsUrls(newDataset) ) {
        this.removeLayer(LAYER_DATASET);
        return;
      }

      // if the opacity has changed, update opacity
      if ( newDataset.opacity !== oldDataset.opacity ) {
        this.layers[LAYER_DATASET].setOpacity(newDataset.opacity);
      }

      // if the new dataset currentFileIndex has changed, reload the layer
      if ( (newDataset.currentFileIndex !== oldDataset.currentFileIndex) ) {
        console.log('currentFileIndex has changed and we update the wms layer. new: %s, old: %s', newDataset.currentFileIndex, oldDataset.currentFileIndex);
        this.updateDatasetWmsLayer(newDataset);
      }

      // if the dataset simply has changed, reload the layer
      if ( (newDataset['dataset_id'] !== oldDataset['dataset_id']) ) {
        console.log('dataset id has changed and we update the wms layer. new: %s, old: %s', newDataset['dataset_id'], oldDataset['dataset_id']);
        this.updateDatasetWmsLayer(newDataset);
      }

      // if min max values have changed, reload the layer
      if (
        (newDataset['variable_min'] !== oldDataset['variable_min']) ||
        (newDataset['variable_max'] !== oldDataset['variable_max'])
      ) {
        console.log('min max values have changed so we reload the dataset');
        this.updateDatasetWmsLayer(newDataset);
      }
    }

    // if there is no displayed dataset, but new dataset has wms urls, load the dataset layer
    if ( !hasDisplayedDataset ) {
      if ( datasetHasWmsUrls(newDataset) ) {
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
          title={this.state.dialogTitle}
          modal={false}
          onRequestClose={this.handleClose}
          open={this.state.dialogOpened}>
          <div>{this.state.dialogContent}</div>
        </Dialog>
      </div>
    );
  }
}
export default OLComponent;
