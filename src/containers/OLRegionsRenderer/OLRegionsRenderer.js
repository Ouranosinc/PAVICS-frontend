import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as regionActions } from './../../redux/modules/Region';
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

export class OLRegionsRenderer extends React.Component {
  static propTypes = {
    layerIndex: PropTypes.number.isRequired,
    layerName: PropTypes.string.isRequired,
    map: PropTypes.object.isRequired, // Type ol/Map
    region: PropTypes.object.isRequired,
    regionActions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.source = null;
    this.layer = null;
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.region.selectedShapefile !== this.props.region.selectedShapefile) {
      this.resetRegions(nextProps)
    }
  }

  /*
   this depends on the previous props because of the way we keep track of the ol layers
   they are stored as a "map" built from their title
   */
  resetRegions (nextProps) {
    const { map } = nextProps;
    const { selectedShapefile } = nextProps.region;
    if(this.source) {
      // this.source.clear();
    }
    if(this.layer) map.removeLayer(this.layer);
    this.source = new TileWMS(
      {
        url: selectedShapefile.wmsUrl,
        params: selectedShapefile.wmsParams
      }
    );
    this.createRegionLayer(map);
  }

  createRegionLayer (map) {
    let layer = new TileLayer({
      visible: true,
      title: this.props.layerName,
      opacity: 0.4,
      source: this.source
    });
    layer.set('nameId', this.props.layerName);
    map.getLayers().insertAt(this.props.layerIndex, layer);
    return layer
  }

  render () {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    region: state.region
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    regionActions: bindActionCreators({...regionActions}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OLRegionsRenderer)
