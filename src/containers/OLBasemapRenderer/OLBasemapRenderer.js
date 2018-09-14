import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as layerBasemapActions } from './../../redux/modules/LayerDataset';
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

// FIXME: Cesium shouldn't be a basemap option eventually
import Cesium from 'cesium/Cesium';
window['Cesium'] = Cesium; // expose Cesium to the OL-Cesium library
require('cesium/Widgets/widgets.css');
import OLCesium from 'ol-cesium';

const G_BING_API_KEY = 'AtXX65CBBfZXBxm6oMyf_5idMAMI7W6a5GuZ5acVcrYi6lCQayiiBz7_aMHB7JR7';

export class OLBasemapRenderer extends React.Component {
  static propTypes = {
    layerBasemap: PropTypes.object.isRequired,
    layerBasemapActions: PropTypes.object.isRequired,
    layerIndex: PropTypes.number.isRequired,
    // layerName: PropTypes.string.isRequired, // layerName <= this.props.layerBasemap.selectedBasemap
    map: PropTypes.instanceOf(Map)
  };

  constructor(props) {
    super(props);
    this.source = null;
    this.layer = null;
    this.ol3d = null;
  }

  componentWillReceiveProps (nextProps) {
    const { map, layerBasemap } = nextProps;
    if (map !== this.props.map) {
      this.init(map); // Once, when map has been initialised
      this.resetBasemap(map, layerBasemap);
    }
    else if (layerBasemap.selectedBasemap !== this.props.layerBasemap.selectedBasemap) {
      this.resetBasemap(this.props.map, layerBasemap);
    }
  }

  init(map) {
    this.source = new OSM();
    this.ol3d = new OLCesium({map: map});
    this.ol3d.setEnabled(false);
  }

  resetBasemap(map, layerBasemap) {
    if (layerBasemap.selectedBasemap === 'Cesium') {
      if(this.layer) map.removeLayer(this.layer);
      this.layer = this.addCesiumTileLayer(map, layerBasemap.selectedBasemap);
      let scene = this.ol3d.getCesiumScene();
      scene.terrainProvider = Cesium.createWorldTerrain();
      this.ol3d.setEnabled(true);
    } else {
      this.ol3d.setEnabled(false);
      if(this.layer) map.removeLayer(this.layer);
      this.layer = this.addBingLayer(map, layerBasemap.selectedBasemap, layerBasemap.selectedBasemap);
    }
  }

  addCesiumTileLayer(map, title) {
    let layer = new TileLayer({
      source: this.source
    });
    map.getLayers().insertAt(this.props.layerIndex, layer);
    layer.set('nameId', title);
    return layer;
  }

  addBingLayer (map, title, bingStyle) {
    let layer = new TileLayer({
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
    });
    map.getLayers().insertAt(this.props.layerIndex, layer);
    layer.set('nameId', title);
    return layer;
  }


  render () {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    layerBasemap: state.layerBasemap,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    layerBasemapActions: bindActionCreators({...layerBasemapActions}, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OLBasemapRenderer)