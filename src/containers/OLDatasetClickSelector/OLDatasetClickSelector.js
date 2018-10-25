import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { transform } from 'ol/proj';
import Map from 'ol/Map';
import { VISUALIZE_MODE_GRID_VALUES } from './../../constants';
import { actions as visualizeActions } from '../../redux/modules/Visualize';

export class OLDatasetClickSelector extends React.Component {
  static propTypes = {
    map: PropTypes.instanceOf(Map),
    layerDataset: PropTypes.object.isRequired,
    visualize: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired,
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

  handleMapClick = event => {
    const { currentDisplayedDataset } = this.props.layerDataset;
    // TODO: Use OL5 Interaction API instead of EventListener
    if (this.props.visualize.mapManipulationMode === VISUALIZE_MODE_GRID_VALUES) {
      if (currentDisplayedDataset['dataset_id'] && currentDisplayedDataset['dataset_id'].length) {
        this.getScalarValue(event.pixel);
      } else {
        console.log('Choose and load a dataset before trying to click on the map to access point scalar value.');
      }
    }
  };

  getScalarValue (pixel) {
    let coordinates = this.props.map.getCoordinateFromPixel(pixel);
    let converted = transform(coordinates, 'EPSG:3857', 'EPSG:4326');
    console.log('scalar value from coosrindates', converted);
    console.log('selected dataset:', this.props.layerDataset.currentDisplayedDataset);
    const opendapUrl = this.props.layerDataset.currentDisplayedDataset['opendap_url'][0];
    const lon = converted[0];
    const lat = converted[1];
    const time = this.props.layerDataset.currentDateTime.substr(0, this.props.layerDataset.currentDateTime.length - 5);
    const variable = this.props.layerDataset.currentDisplayedDataset['variable'];
    this.props.visualizeActions.fetchScalarValue(opendapUrl, lat, lon, time, variable);
  }

  render () {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    layerDataset: state.layerDataset,
    visualize: state.visualize
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    visualizeActions: bindActionCreators({...visualizeActions}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OLDatasetClickSelector)
