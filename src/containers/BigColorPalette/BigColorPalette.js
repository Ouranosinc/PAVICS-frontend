import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as layerDatasetActions } from './../../redux/modules/LayerDataset';
import BigColorPalette from './../../components/BigColorPalette';

const mapStateToProps = (state) => {
  return {
    currentDisplayedDataset: state.layerDataset.currentDisplayedDataset,
    preference: state.layerDataset.variablePreferences[state.layerDataset.currentDisplayedDataset.variable]
  }
};
const mapDispatchToProps = {
  setVariablePreferenceBoundaries: layerDatasetActions.setVariablePreferenceBoundaries
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BigColorPalette)
