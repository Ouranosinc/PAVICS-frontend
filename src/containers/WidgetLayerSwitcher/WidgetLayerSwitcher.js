import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as layerBasemapActions } from './../../redux/modules/LayerBasemap';
import { actions as layerDatasetActions } from './../../redux/modules/LayerDataset';
import { actions as layerRegionActions } from '../../redux/modules/LayerRegion';
import { actions as visualizeActions } from './../../redux/modules/Visualize';
import WidgetLayerSwitcher from './../../components/WidgetLayerSwitcher';

const mapStateToProps = (state) => {
  return {
    layerBasemap: state.layerBasemap,
    layerDataset: state.layerDataset,
    layerRegion: state.layerRegion,
    visualize: state.visualize
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    layerBasemapActions: bindActionCreators({...layerBasemapActions}, dispatch),
    layerDatasetActions: bindActionCreators({...layerDatasetActions}, dispatch),
    layerRegionActions: bindActionCreators({...layerRegionActions}, dispatch),
    visualizeActions: bindActionCreators({...visualizeActions}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetLayerSwitcher)
