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
    loadedWmsDatasets: React.PropTypes.array.isRequired
  }

  constructor (props) {
    super(props);
    this.layersCount = 0;
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
  addTileWMSLayer (
    title,
    layers,
    wmsUrl,
    wmsParams,
    extent,
    serverType,
    visible = true
  ) {
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
    if (extent === undefined) {
      return new ol.layer.Tile(
        {
          visible: visible,
          title: title,
          opacity: 0.4, // TODO: Set opacity dynamically
          source: new ol.source.TileWMS(
            {
              url: wmsUrl,
              params: wmsParams,
              serverType: serverType
            })
        });
    } else {
      return new ol.layer.Tile(
        {
          title: title,
          extent: extent,
          source: new ol.source.TileWMS(
            {
              url: wmsUrl,
              params: wmsParams,
              serverType: serverType
            })
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
    // this.map = null
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.loadedWmsDatasets.length && this.layersCount !== this.props.loadedWmsDatasets.length) {
      let wmsUrl = this.props.loadedWmsDatasets[this.props.loadedWmsDatasets.length - 1].url;
      // let wmsUrl = "http://132.217.140.31:8080/ncWMS2/wms"
      /* http://132.217.140.31:8080/ncWMS2/wms?
       FORMAT=image%2Fpng&
       TRANSPARENT=TRUE&
       STYLES=default-scalar%2Fdefault&
       LAYERS=aet_pcp_1970%2FPCP&
       TIME=1970-12-31T18%253A00%253A00.000Z&
       COLORSCALERANGE=-0.00004458%2C0.0009362&
       NUMCOLORBANDS=250&
       ABOVEMAXCOLOR=0x000000&
       BELOWMINCOLOR=0x000000&
       BGCOLOR=transparent&
       LOGSCALE=false&
       SERVICE=WMS&
       VERSION=1.1.1&
       REQUEST=GetMap&
       SRS=EPSG%3A4326&
       BBOX=-74.40659123765,68.390113143525,-21.609886856475,121.18681752
       */
      /*
       http://132.217.140.31:8080/ncWMS2/wms?
       REQUEST=GetLegendGraphic&
       PALETTE=default&
       COLORBARONLY=true&
       WIDTH=110&
       HEIGHT=264&
       SERVICE=WMS&
       VERSION=1.3.0&
       REQUEST=GetMap&
       FORMAT=image%2Fpng&
       TRANSPARENT=TRUE&
       LAYERS=aet_pcp_1970&
       BGCOLOR=transparent&
       SRS=EPSG%3A4326&
       WIDTH=256&
       HEIGHT=256&
       CRS=EPSG%3A3857&
       STYLES=&
       BBOX=-7514065.628545966%2C7514065.628545966%2C-5009377.08569731%2C10018754.171394622
       */
      let wmsName = this.props.loadedWmsDatasets[this.props.loadedWmsDatasets.length - 1].name;
      // TODO: Do we need to dynamically set style + palette
      let wmsParams = {
        'TRANSPARENT': 'TRUE',
        'STYLES': this.props.loadedWmsDatasets[this.props.loadedWmsDatasets.length - 1].style,
        'LAYERS': this.props.loadedWmsDatasets[this.props.loadedWmsDatasets.length - 1].name,
        'COLORSCALERANGE': [-0.00004458, 0.0009362],
        'NUMCOLORBANDS': 250,
        // 'ABOVEMAXCOLOR': '0x000000',
        // 'BELOWMINCOLOR': '0x000000',
        'BGCOLOR': 'transparent',
        'TIME': this.props.loadedWmsDatasets[this.props.loadedWmsDatasets.length - 1].start,
        // -> /1970-12-31T18:00:00.000Z',
        // TODO DYNAMICALLY SET TIME
        'SRS': 'EPSG:4326'
        // 'ANIMATION': 'TRUE' // TODO: Must be supported by ncWMS server?
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
