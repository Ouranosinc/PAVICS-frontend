import React from 'react';
import classes from './OLComponent.scss';
import ol from 'openlayers';
import Dialog from 'material-ui/Dialog';
import * as constants from './../../constants';
import myHttp from './../../../lib/http';
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
class OLComponent extends React.Component {
  static propTypes = {
    currentDateTime: React.PropTypes.string.isRequired,
    mapManipulationMode: React.PropTypes.string.isRequired,
    setCurrentDateTime: React.PropTypes.func.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    selectedColorPalette: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
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
    this.view = new ol.View(
      {
        center: [-10997148, 8569099],
        zoom: 4
      }
    );
    this.map = new ol.Map(
      {
        controls: [],
        layers: [],
        target: 'map',
        renderer: 'canvas',
        view: this.view
      }
    );
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
    console.log('selected dataset:', this.props.selectedDatasetLayer);
    let opendapUrl = this.props.selectedDatasetLayer['opendap_urls'][0];
    let lon = converted[0];
    let lat = converted[1];
    let time = this.props.currentDateTime.substr(0, this.props.currentDateTime.length - 5);
    let variable = this.props.selectedDatasetLayer['variable'][0];
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
        if (this.props.selectedDatasetLayer['dataset_id']) {
          console.log('selected dataset:', this.props.selectedDatasetLayer);
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

  setDatasetLayer (prevProps) {
    console.log('setting new dataset layer', this.props.selectedDatasetLayer);
    let wmsUrl = this.props.selectedDatasetLayer.wms_url;
    let parser = new ol.format.WMSCapabilities();
    let capabilities = {};
    myHttp.get(wmsUrl)
      .then(
        response => response.text(),
        err => console.log(err)
      )
      .then(
        text => {
          capabilities = parser.read(text);
          console.log('wms capabilities:', capabilities);
          let url = capabilities['Service']['OnlineResource'];
          // very nesting
          let layer = capabilities['Capability']['Layer']['Layer'][0]['Layer'][0];
          let layerName = layer['Name'];
          let wmsParams = {
            'ABOVEMAXCOLOR': 'extend',
            'TRANSPARENT': 'TRUE',
            'STYLES': 'default-scalar/seq-Blues', // TODO UI switcher for styles
            'LAYERS': layerName,
            'EPSG': '4326',
            'LOGSCALE': false,
            'crossOrigin': 'anonymous',
            'BGCOLOR': 'transparent',
            'SRS': 'EPSG:4326',
            'TIME': ''
          };
          if (layer['Dimension']) {
            // Only if a temporal dimension exists
            let timeDimension = this.findDimension(layer['Dimension'], 'time');
            let date = timeDimension.values.substring(0, 24);
            this.props.fetchWMSLayerTimesteps(url, layerName, date);
            this.props.setCurrentDateTime(date);
          } else {
            // wmsParams['ELEVATION'] = 0;
          }
          this.map.removeLayer(this.layers[LAYER_DATASET]);
          this.datasetSource = new ol.source.TileWMS(
            {
              url: url,
              params: wmsParams
            }
          );
          this.addTileWMSLayer(INDEX_DATASET_LAYER, LAYER_DATASET, this.datasetSource, this.props.selectedDatasetLayer.opacity);
          this.props.setSelectedDatasetCapabilities(capabilities);
          this.props.fetchWMSLayerDetails(url, layerName);
        },
        err => console.log(err)
      );
  }

  updateColorPalette () {
    // TODO there is something that feels somewhat wrong about having the datasetLayer in a prop
    // it might be totally ok, but be bit careful ot
    if (this.layers[LAYER_DATASET]) {
      console.log('changing color palette:', this.props.selectedColorPalette.name);
      this.datasetSource.updateParams({
        'STYLES': this.props.selectedColorPalette.name
      });
    } else {
      console.log('select a dataset first');
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.selectedColorPalette !== prevProps.selectedColorPalette) {
      this.updateColorPalette();
    }
    if (this.props.selectedBasemap !== prevProps.selectedBasemap) {
      this.setBasemap(prevProps);
    }
    if (this.props.selectedShapefile !== prevProps.selectedShapefile) {
      this.setShapefile(prevProps);
    }
    if (this.props.selectedDatasetLayer !== prevProps.selectedDatasetLayer && !this.props.selectedDatasetLayer.capabilities) {
      if (this.props.selectedDatasetLayer.opacity !== prevProps.selectedDatasetLayer.opacity && this.props.selectedDatasetLayer.opacity > 0) {
        this.layers[LAYER_DATASET].setOpacity(this.props.selectedDatasetLayer.opacity);
      } else if (Object.keys(this.props.selectedDatasetLayer).length === 0 && this.props.selectedDatasetLayer.constructor === Object) {
        this.map.removeLayer(this.layers[LAYER_DATASET]);
      } else {
        this.setDatasetLayer(this.props.selectedDatasetLayer);
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
