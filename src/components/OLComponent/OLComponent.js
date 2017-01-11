import React from 'react';
import classes from './OLComponent.scss';
import ol from 'openlayers';
// _ol3-layerswitcher.js needs ol as global (...)
window.ol = ol;
require('ol3-layerswitcher/src/ol3-layerswitcher.js');
require('openlayers/css/ol.css');
require('ol3-layerswitcher/src/ol3-layerswitcher.css');
// Couldn't figure out the bug when importing inner component css file but it works from node_modules
let G_BING_API_KEY = 'AtXX65CBBfZXBxm6oMyf_5idMAMI7W6a5GuZ5acVcrYi6lCQayiiBz7_aMHB7JR7';
class OLComponent extends React.Component {
  static propTypes = {
    capabilities: React.PropTypes.object,
    dataset: React.PropTypes.object,
    loadedWmsDatasets: React.PropTypes.array.isRequired,
    layer: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props);
    this.layersCount = 0;
    this.layers = [];
    this.map = null;
    this.baseLayers = new ol.layer.Group({'title': 'Base maps', 'opacity': 1.0, 'visible': true, 'zIndex': 0});
    this.overlayLayers = new ol.layer.Group({'title': 'Overlays', 'opacity': 1.0, 'visible': true, 'zIndex': 1});
    this.view = null;
    this.tmpLayer = null;
    this.popup = null;
  }

  // Returns base layers list
  getMapBaseLayersList () {
    if (this.baseLayers != null) {
      return this.baseLayers.getLayers();
    }
    return [];
  }

  // Returns overlay layers list
  getMapOverlayList () {
    if (this.overlayLayers != null) {
      return this.overlayLayers.getLayers();
    }
    return [];
  }

  // Add backgrounnd layer (use once)
  initBackgroundLayer () {
    this.addBingLayer('Aerial', this.getMapBaseLayersList(), 'Aerial');
    // let wmsUrl = "http://demo.boundlessgeo.com/geoserver/wms"
    // let wmsParams = {'LAYERS': 'topp:states', 'TILED': true}
    // this.addTileWMSLayer('topp:states', this.getMapOverlayList(), wmsUrl, wmsParams)
  }

  removeLayer (layers, title) {
    let layer;
    for (layer in layers) {
      if (layers.hasOwnProperty(layer)) {
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
  addTileWMSLayer (title, layers, wmsUrl, wmsParams, extent, serverType, visible = true) {
    let layer = this.getTileWMSLayer(title,
      wmsUrl,
      wmsParams,
      extent,
      serverType,
      visible);
    layers.push(layer);
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

  addBingLayer (title, layers, bingStyle) {
    layers.push(new ol.layer.Tile({
      visible: true,
      preload: Infinity,
      source: new ol.source.BingMaps({
        key: G_BING_API_KEY,
        imagerySet: bingStyle
        // use maxZoom 19 to see stretched tiles instead of the BingMaps
        // "no photos at this zoom level" tiles
        // maxZoom: 19
      })
    }));
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
    this.layers.push(layer)
  };

  initMap () {
    this.view = new ol.View({
      center: [-10997148, 8569099],
      zoom: 4
    });
    let map = new ol.Map({
      layers: [this.baseLayers, this.overlayLayers],
      target: 'map',
      renderer: 'canvas',
      view: this.view
    });
    let mousePosition = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(6),
      projection: 'EPSG:4326',
      target: document.getElementById('mouseCoordinates')
    });
    map.addControl(mousePosition);
    let layerSwitcher = new ol.control.LayerSwitcher({
      tipLabel: 'Legend' // Optional label for button
    });
    map.addControl(layerSwitcher);
    this.map = map;
  }

  /** Returns view resolution */
  getCurrentResolution () {
    if (this.view != null) {
      return this.view.getResolution();
    }
    return -1;
  }

  /** Sets view resolution */
  setCurrentResolution (resolution) {
    if (this.view != null) {
      this.view.setResolution(resolution);
    }
  }

  /** Returns current view center */
  getCurrentCenter () {
    if (this.view != null) {
      return this.view.getCenter();
    }
    return [];
  }

  /** Sets current view center */
  setCurrentCenter (center) {
    if (this.view != null) {
      this.view.setCenter(center);
    }
    return [];
  }

  /** Returns current projection */
  getCurrentProjection () {
    if (this.view != null) {
      return this.view.getProjection();
    }
    return '';
  }

  /** Sets current projection */
  setCurrentProjection (epsgString) {
    if (this.view != null) {
      this.view.setProjection(epsgString);
    }
  }

  componentDidMount () {
    this.initBackgroundLayer();
    this.initMap();
  }

  componentWillUnmount () {
    // TODO: Verify if usefull
    // this.map.setTarget(null)
    // this.map = null//
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentDateTime && nextProps.currentDateTime !== this.props.currentDateTime) {
      if(this.source){
        this.source.updateParams({
          TIME: nextProps.currentDateTime
        });
        console.log('Openlayers time changed ' + nextProps.currentDateTime);
      }
    }
  }


  componentDidUpdate (prevProps, prevState) {
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
      this.tmpLayer = this.addTileWMSLayer(wmsName, this.getMapOverlayList(), wmsUrl, wmsParams);
      this.layersCount = this.props.loadedWmsDatasets.length;
    } else {
    }
  }

  render () {
    return (
      <div className={classes['OLComponent']}>
        <div id="map" className="map">
          <div id="popup" className="ol-popup"></div>
        </div>
      </div>
    );
  }
}
export default OLComponent;
