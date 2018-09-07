import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as regionActions } from './../../redux/modules/Region';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

export class OLRegionsRenderer extends React.Component {
  static propTypes = {
    layerIndex: PropTypes.number.isRequired,
    layerName: PropTypes.string.isRequired,
    map: PropTypes.instanceOf(Map),
    region: PropTypes.object.isRequired,
    regionActions: PropTypes.object.isRequired,
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
    } else if (nextProps.region.selectedShapefile !== this.props.region.selectedShapefile) {
      this.resetRegions(nextProps)
    }
  }

  init(map) {

  }

  resetRegions (nextProps) {
    const { map } = nextProps;
    const { selectedShapefile } = nextProps.region;
    const params = {
      url: selectedShapefile.wmsUrl,
      params: selectedShapefile.wmsParams
    };

    if(this.source) {
      // Should but does not work
      // this.source.updateParams(params);
      map.removeLayer(this.layer);
    }
    this.source = new TileWMS(params);
    this.layer = this.createRegionLayer(map);

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
