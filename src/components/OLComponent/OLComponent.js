import React from 'react';
import classes from './OLComponent.scss';
import ol from 'openlayers';
import Dialog from 'material-ui/Dialog';
// Couldn't figure out the bug when importing inner component css file but it works from node_modules
let G_BING_API_KEY = 'AtXX65CBBfZXBxm6oMyf_5idMAMI7W6a5GuZ5acVcrYi6lCQayiiBz7_aMHB7JR7';
const INDEX_BASE_MAP = -10;
const INDEX_SELECTED_REGIONS = 1000;
class OLComponent extends React.Component {
  static propTypes = {
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedBasemap: React.PropTypes.string.isRequired,
    capabilities: React.PropTypes.object,
    dataset: React.PropTypes.object,
    loadedWmsDatasets: React.PropTypes.array.isRequired,
    layer: React.PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.layersCount = 0;
    this.layers = [];
    this.map = null;
    this.view = null;
    this.tmpLayer = null;
    this.state = {
      dialogContent: '',
      dialogOpened: false
    };
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  removeLayer (layers, title) {
    let layer;
    for (layer in layers) {
      if (layers.hasOwnProperty(layer)) {
        console.log('layer:', layer);
        if (title === layer.get('title')) {
          console.log('addTileWMSLayer: First Remove layer ' + layer.get('title'));
          this.map.removeLayer(layer);
        }
      }
    }
  }

  /*! \brief Adds a layer to a layers list
   @param layers layers input list
   @param wmsUrl wms url
   @param wmsParams parameters associated to the wms
   @param extent region extent to load
   @param serverType Server's type
   */
  addTileWMSLayer (title, wmsUrl, wmsParams, extent, serverType, visible = true) {
    let layer = this.getTileWMSLayer(
      title,
      wmsUrl,
      wmsParams,
      extent,
      serverType,
      visible
    );
    this.layers[title] = layer;
    this.map.addLayer(layer);
    console.log('addTileWMSLayer: Add layer ' + layer.get('title'));
    return layer;
  }

  /*! \brief Returns a ol3 layer to a layers list
   @param layers layers input list
   @param wmsUrl wms url
   @param wmsParams parameters associated to the wms
   @param extent region extent to load
   @param serverType Server's type
   */
  getTileWMSLayer (
    title,
    wmsUrl,
    wmsParams,
    extent,
    serverType = '',
    visible = true
  ) {
    if (this.layers[title] !== undefined) {
      return this.layers[title];
    }
    this.source = new ol.source.TileWMS(
      {
        url: wmsUrl,
        params: wmsParams,
        serverType: serverType
      });
    if (extent === undefined) {
      return new ol.layer.Tile(
        {
          visible: visible,
          title: title,
          opacity: 0.4, // TODO: Set opacity dynamically
          source: this.source
        });
    } else {
      return new ol.layer.Tile(
        {
          title: title,
          extent: extent,
          source: this.source
        });
    }
  }

  addBingLayer (title, bingStyle) {
    let layer = new ol.layer.Tile({
      visible: true,
      preload: Infinity,
      source: new ol.source.BingMaps({
        key: G_BING_API_KEY,
        imagerySet: bingStyle
        // use maxZoom 19 to see stretched tiles instead of the BingMaps
        // "no photos at this zoom level" tiles
        // maxZoom: 19
      })
    });
    this.map.getLayers().insertAt(INDEX_BASE_MAP, layer);
    this.layers[title] = layer;
  }

  getLayer (title) {
    if (this.layers[title] !== undefined) {
      return this.layers[title];
    }
    return null;
  }

  makeWMSlayer (title, url, time, styles, layerName) {
    this.source = new ol.source.TileWMS({
      url: url,
      params: {
        TIME: time,
        FORMAT: 'image/png',
        TILED: true,
        STYLES: styles,
        LAYERS: layerName,
        TRANSPARENT: 'TRUE',
        VERSION: '1.3.0',
        EPSG: '4326',
        COLORSCALERANGE: '0.0000004000,0.00006000',
        NUMCOLORBANDS: '10',
        LOGSCALE: false,
        crossOrigin: 'anonymous'
      }
    });
    let layer = new ol.layer.Tile({
      visible: true,
      opacity: 0.7,
      title: title,
      source: this.source
    });
    this.map.addLayer(layer);
    this.layers.push(layer);
  };

  initMap () {
    this.view = new ol.View({
      center: [-10997148, 8569099],
      zoom: 4
    });
    this.map = new ol.Map({
      controls: [],
      layers: [],
      target: 'map',
      renderer: 'canvas',
      view: this.view
    });
  }

  createVectorLayer (nameId) {
    let source = new ol.source.Vector({
      format: new ol.format.GeoJSON()
    });
    let fill = new ol.style.Fill({
      color: 'rgba(0,255,255,0.5)'
    });
    let stroke = new ol.style.Stroke({
      color: 'rgba(255,255,255,0.5)'
    });
    let style = new ol.style.Style({
      fill: fill,
      stroke: stroke
    });
    let layer = new ol.layer.Vector({
      source: source,
      style: style
    });
    layer.set('nameId', nameId);
    return layer;
  }

  handleMapClick (event) {
    let coordinates = this.map.getCoordinateFromPixel(event.pixel);
    let converted = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
    console.log('coordinate:', converted);
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
      .then(response => {
        return response.json();
      })
      .then((response) => {
        let id = response.features[0].id;
        console.log(id);
        let content = `lat: ${converted[0]}, lon: ${converted[1]}, feature id: ${id}`;
        let format = new ol.format.GeoJSON();
        let features = format.readFeatures(response, {featureProjection: 'EPSG:3857'});
        this.layers['selectedRegions'].getSource().addFeatures(features);
        this.setState({
          dialogContent: content,
          dialogOpened: true
        });
      });
  }

  componentDidMount () {
    this.initMap();
    this.map.addEventListener('click', this.handleMapClick);
    let layer = this.createVectorLayer('selectedRegions');
    this.map.getLayers().insertAt(INDEX_SELECTED_REGIONS, layer);
    this.layers['selectedRegions'] = layer;
  }

  componentWillUnmount () {
    // TODO: Verify if usefull
    // this.map.setTarget(null)
    // this.map = null//
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentDateTime && nextProps.currentDateTime !== this.props.currentDateTime) {
      if (this.source) {
        this.source.updateParams({
          TIME: nextProps.currentDateTime
        });
        console.log('Openlayers time changed ' + nextProps.currentDateTime);
        this.source.setTileLoadFunction(this.source.getTileLoadFunction());
        this.source.changed();
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
    this.layers['selectedRegions'].getSource().clear();
    let layer = this.getTileWMSLayer(
      prevProps.selectedShapefile.title,
      prevProps.selectedShapefile.wmsUrl,
      prevProps.selectedShapefile.wmsParams
    );
    this.map.removeLayer(
      layer
    );
    this.addTileWMSLayer(
      shapefile.title,
      shapefile.wmsUrl,
      shapefile.wmsParams
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
      .then(response => {
        return response.text();
      })
      .then(text => {
        capabilities = parser.read(text);
        console.log('wms capabilities:', capabilities);
        let url = capabilities['Service']['OnlineResource'];
        let wmsName = this.props.selectedDatasetLayer['dataset_id'];
        // very nesting
        let layer = capabilities['Capability']['Layer']['Layer'][0]['Layer'][0];
        let layerName = layer['Name'];
        let timeDimension = this.findDimension(layer['Dimension'], 'time');
        console.log('got time dimension:', timeDimension);
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
        this.addTileWMSLayer(wmsName, url, wmsParams);
      });

  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.selectedBasemap !== prevProps.selectedBasemap) {
      this.setBasemap(prevProps);
    }
    if (this.props.selectedShapefile !== prevProps.selectedShapefile) {
      this.setShapefile(prevProps);
    }
    if (this.props.selectedDatasetLayer !== prevProps.selectedDatasetLayer) {
      this.setDatasetLayer(prevProps);
    }
    if (this.props.layer && this.props.layer.title) {
      let layer = this.props.layer;
      console.log('making wms layer', layer);
      this.makeWMSlayer(layer.title, layer.url, layer.time, layer.style, layer.name);
    }
    if (this.props.loadedWmsDatasets.length && this.layersCount !== this.props.loadedWmsDatasets.length) {
      let wmsUrl = this.props.loadedWmsDatasets[this.props.loadedWmsDatasets.length - 1].url;
      let wmsName = this.props.loadedWmsDatasets[this.props.loadedWmsDatasets.length - 1].name;
      // TODO: Do we need to dynamically set style + palette
      let wmsParams = {
        'TRANSPARENT': 'TRUE',
        'STYLES': this.props.loadedWmsDatasets[this.props.loadedWmsDatasets.length - 1].style,
        'LAYERS': this.props.loadedWmsDatasets[this.props.loadedWmsDatasets.length - 1].name,
        'EPSG': '4326',
        'COLORSCALERANGE': '0.0000004000,0.00006000',
        'NUMCOLORBANDS': '10',
        'LOGSCALE': false,
        'crossOrigin': 'anonymous',
        'BGCOLOR': 'transparent',
        'TIME': this.props.loadedWmsDatasets[this.props.loadedWmsDatasets.length - 1].start,
        'SRS': 'EPSG:4326'
      };
      if (this.tmpLayer) {
        // this.tmpLayer.setVisible(false)
        this.map.removeLayer(this.tmpLayer);
      }
      this.tmpLayer = this.addTileWMSLayer(wmsName, wmsUrl, wmsParams);
      this.layersCount = this.props.loadedWmsDatasets.length;
    }
  }

  handleClose () {
    this.setState({
      dialogContent: '',
      dialogOpened: false
    });
  }

  render () {
    return (
      <div className={classes['OLComponent']}>
        <div id="map" className="map" style={{'width': '100%', 'height': '100%', 'position': 'fixed'}}>
          <div id="popup" className="ol-popup"></div>
        </div>
        <Dialog
          title="Coordinates"
          modal={false}
          onRequestClose={this.handleClose}
          open={this.state.dialogOpened}>
          {this.state.dialogContent}
        </Dialog>
      </div>
    );
  }
}
export default OLComponent;
