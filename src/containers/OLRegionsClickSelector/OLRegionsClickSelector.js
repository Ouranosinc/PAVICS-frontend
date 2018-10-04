import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Map from 'ol/Map';
import { add } from 'ol/coordinate';
import { VISUALIZE_MODE_REGION_SELECTION } from './../../constants';
import { actions as layerRegionActions } from '../../redux/modules/LayerRegion';

export class OLRegionsClickSelector extends React.Component {
  static propTypes = {
    map: PropTypes.instanceOf(Map),
    queryGeoserverFeatures: PropTypes.func.isRequired,
    layerRegion: PropTypes.object.isRequired,
    layerRegionActions: PropTypes.object.isRequired,
    visualize: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps (nextProps) {
    const { map } = nextProps;
    if (map !== this.props.map) {
      this.init(map); // Once, when map has been initialised
    }
  }

  init(map) {
    // TODO: Use OL5 Interaction API instead of EventListener
    map.addEventListener('click', this.handleMapClick);
  }

  handleSelectRegionClick (event) {
    let extent = this.calculateClickPositionExtent(event.pixel);
    this.props.queryGeoserverFeatures(extent);
  }

  handleMapClick = (event) => {
    const { selectedShapefile } = this.props.layerRegion;
    if (this.props.visualize.mapManipulationMode === VISUALIZE_MODE_REGION_SELECTION) {
      if (selectedShapefile.title && selectedShapefile.title.length) {
        this.handleSelectRegionClick(event);
      } else {
        console.log('Choose and load a shapefile before trying to click on the map to select a region.');
      }
    }
  }

  calculateClickPositionExtent(pixel) {
    let coordinates = this.props.map.getCoordinateFromPixel(pixel);
    let tl = add(coordinates, [-10e-6, -10e-6]);
    let br = add(coordinates, [10e-6, 10e-6]);
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
    return [minX, minY, maxX, maxY];
  }

  render () {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    layerRegion: state.layerRegion,
    visualize: state.visualize
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
)(OLRegionsClickSelector)
