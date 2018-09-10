import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as layerDatasetActions } from './../../redux/modules/LayerDataset';
import { actions as layerRegionActions } from '../../redux/modules/LayerRegion';
import { actions as visualizeActions } from './../../redux/modules/Visualize';
import WidgetLayerSwitcher from './../../components/WidgetLayerSwitcher';

const mapStateToProps = (state) => {
  return {
    layerDataset: state.layerDataset,
    layerRegion: state.layerRegion,
    visualize: state.visualize
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    layerDatasetActions: bindActionCreators({...layerDatasetActions}, dispatch),
    layerRegionActions: bindActionCreators({...layerRegionActions}, dispatch),
    visualizeActions: bindActionCreators({...visualizeActions}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetLayerSwitcher)
