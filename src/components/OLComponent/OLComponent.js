import React from 'react';
import classes from './OLComponent.scss';
import ol from 'openlayers';
import Dialog from 'material-ui/Dialog';
import * as constants from './../../constants';
import DatasetScalarValue from './../DatasetScalarValue';
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
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedBasemap: React.PropTypes.string.isRequired,
    selectedDatasetCapabilities: React.PropTypes.object.isRequired,
    setSelectedDatasetCapabilities: React.PropTypes.func.isRequired,
    capabilities: React.PropTypes.object,
    dataset: React.PropTypes.object,
    layer: React.PropTypes.object.isRequired,
    fetchWMSLayerDetails: React.PropTypes.func.isRequired,
    fetchWMSLayerTimesteps: React.PropTypes.func.isRequired,
    fetchPlotlyData: React.PropTypes.func.isRequired
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
  }

  addTileWMSLayer (position, title, source, extent, visible = true) {
    let layer = new ol.layer.Tile(
      {
        visible: visible,
        title: title,
        opacity: 0.4, // TODO: Set opacity dynamically
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
    let style = new ol.style.Style(
      {
        fill: fill,
        stroke: stroke
      }
    );
    let layer = new ol.layer.Vector(
      {
        source: source,
        style: style,
        opacity: 1
      }
    );
    layer.set('nameId', nameId);
    return layer;
  }

  selectRegion (event) {
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
    fetch(url)
      .then(response => response.json())
      .then(
        response => {
          // ici
          let id = response.features[0].id;
          console.log(id);
          let converted = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
          let content = `lat: ${converted[0]}, lon: ${converted[1]}, feature id: ${id}`;
          let format = new ol.format.GeoJSON();
          let features = format.readFeatures(response, { featureProjection: 'EPSG:3857' });
          this.layers[LAYER_SELECTED_REGIONS].getSource().addFeatures(features);
          this.setState(
            {
              ...this.state,
              dialogContent: content,
              dialogOpened: true
            }
          );
        }
      );
  }

  getScalarValue (event) {
    let coordinates = this.map.getCoordinateFromPixel(event.pixel);
    let converted = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
    console.log('scalar value from coosrindates', converted);
    console.log('selected dataset:', this.props.selectedDatasetLayer);
    let opendapUrl = this.props.selectedDatasetLayer['opendap_urls'][0];
    let lat = converted[0];
    let lon = converted[1];
    let time = this.props.currentDateTime.substr(0, this.props.currentDateTime.length - 5);
    // TODO dialog to choose variable dynamically
    let variable = this.props.selectedDatasetLayer['variable'][0];
    let url = `/wps/getpoint?opendapUrl=${opendapUrl}&lat=${lat}&lon=${lon}&time=${time}&variable=${variable}`;
    fetch(url)
      .then(res => res.json())
      .then(
        json => {
          console.log(json);
          this.setState(
            {
              ...this.state,
              dialogContent: (
                <DatasetScalarValue
                  selectedDatasetCapabilities={this.props.selectedDatasetCapabilities}
                  opendapUrl={this.props.selectedDatasetLayer['opendap_urls'][0]}
                  fetchPlotlyData={this.props.fetchPlotlyData}
                  pointResult={json['pr']} />
              ),
              dialogOpened: true,
              dialogTitle: 'Point Result Data'
            }
          );
        }
      );
  }

  handleMapClick (event) {
    console.log(this.props.selectedDatasetLayer);
    switch (this.props.mapManipulationMode) {
      case constants.VISUALIZE_MODE_JOB_MANAGEMENT:
        return this.selectRegion(event);
      case constants.VISUALIZE_MODE_VISUALIZE:
        if (this.props.selectedDatasetLayer['dataset_id']) {
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
      source
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
    fetch(wmsUrl)
      .then(
        response => {
          return response.text();
        }
      )
      .then(
        text => {
          capabilities = parser.read(text);
          console.log('wms capabilities:', capabilities);
          let url = capabilities['Service']['OnlineResource'];
          // very nesting
          let layer = capabilities['Capability']['Layer']['Layer'][0]['Layer'][0];
          let layerName = layer['Name'];
          let timeDimension = this.findDimension(layer['Dimension'], 'time');
          let wmsParams = {
            'TRANSPARENT': 'TRUE',
            'STYLES': 'default',
            'LAYERS': layerName,
            'EPSG': '4326',
            'COLORSCALERANGE': '0.0000004000,0.00006000',
            'NUMCOLORBANDS': '10',
            'LOGSCALE': false,
            'crossOrigin': 'anonymous',
            'BGCOLOR': 'transparent',
            'TIME': timeDimension['default'],
            'SRS': 'EPSG:4326'
          };
          this.map.removeLayer(this.layers[LAYER_DATASET]);
          this.datasetSource = new ol.source.TileWMS(
            {
              url: url,
              params: wmsParams
            }
          );
          this.addTileWMSLayer(INDEX_DATASET_LAYER, LAYER_DATASET, this.datasetSource);
          this.props.setSelectedDatasetCapabilities(capabilities);
          // timeDimension.values is rarely a time range splitted by /
          let date = timeDimension.values.substring(0, 24); // layer['Dimension'][0].values.split('/')[0];
          this.props.fetchWMSLayerDetails(url, layerName);
          this.props.fetchWMSLayerTimesteps(url, layerName, date);
          this.props.setCurrentDateTime(date);
        }
      );
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.selectedBasemap !== prevProps.selectedBasemap) {
      this.setBasemap(prevProps);
    }
    if (this.props.selectedShapefile !== prevProps.selectedShapefile) {
      this.setShapefile(prevProps);
    }
    if (this.props.selectedDatasetLayer !== prevProps.selectedDatasetLayer && !this.props.selectedDatasetLayer.capabilities) {
      console.log(this.props.selectedDatasetLayer);
      if (Object.keys(this.props.selectedDatasetLayer).length === 0 && this.props.selectedDatasetLayer.constructor === Object) {
        console.log('removing dataset layer');
        this.map.removeLayer(this.layers[LAYER_DATASET]);
      } else {
        this.setDatasetLayer(prevProps);
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
        <div id="map" className="map" style={{ 'width': '100%', 'height': '100%', 'position': 'fixed' }}>
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
