import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as layerRegionActions } from '../../redux/modules/LayerRegion';
import Map from 'ol/Map';
// import TileLayer from 'ol/layer/Tile';
// import TileWMS from 'ol/source/TileWMS';
import {Image as ImageLayer} from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';

export class OLRegionsRenderer extends React.Component {
  static propTypes = {
    layerZIndex: PropTypes.number.isRequired,
    layerName: PropTypes.string.isRequired,
    map: PropTypes.instanceOf(Map),
    layerRegion: PropTypes.object.isRequired,
    layerRegionActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.source = null;
    this.layer = null;
  }

  componentWillReceiveProps (nextProps) {
    const { map } = nextProps;
    if (map !== this.props.map) {
      this.init(map);
    } else if (nextProps.layerRegion.selectedFeatureLayer !== this.props.layerRegion.selectedFeatureLayer) {
      this.resetRegions(nextProps);
    }
  }

  init(map) {

  }

  resetRegions (nextProps) {
    const { map } = nextProps;
    const { selectedFeatureLayer } = nextProps.layerRegion;
    const params = {
      url: selectedFeatureLayer.wmsUrl,
      params: selectedFeatureLayer.wmsParams,
      ratio: 1,
      serverType: 'geoserver'
    };

    if (this.source) {
      // Should but does not work
      // this.source.updateParams(params);
      map.removeLayer(this.layer);
    }

    // Single Image Tile WMS Prototype
    // https://stackoverflow.com/questions/2883122/openlayers-layers-tiled-vs-single-tile
    // this.source = new TileWMS(params);
    this.source = new ImageWMS(params);
    this.layer = this.createRegionLayer(map);

  }

  createRegionLayer (map) {
    let layer = new ImageLayer({
    // let layer = new TileLayer({
      visible: true,
      title: this.props.layerName,
      opacity: 0.4,
      source: this.source
    });
    layer.set('nameId', this.props.layerName);
    map.getLayers().insertAt(this.props.layerZIndex, layer);
    return layer;
  }

  render () {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    layerRegion: state.layerRegion
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    layerRegionActions: bindActionCreators({...layerRegionActions}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OLRegionsRenderer);
