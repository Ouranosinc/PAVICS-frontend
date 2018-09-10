import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import WidgetTimeSlider from './../../components/WidgetTimeSlider';
import { actions as layerDatasetActions } from '../../redux/modules/LayerDataset';

const mapStateToProps = (state) => {
  return {
    currentDateTime: state.layerDataset.currentDateTime,
    currentDisplayedDataset: state.layerDataset.currentDisplayedDataset,
    selectedWMSLayerTimesteps:state.layerDataset.selectedWMSLayerTimesteps,
    selectedWMSLayerDetails:state.layerDataset.selectedWMSLayerDetails
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(
      {
        setCurrentDateTime: layerDatasetActions.setCurrentDateTime,
        selectCurrentDisplayedDataset: layerDatasetActions.selectCurrentDisplayedDataset
      },
      dispatch,
    )
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetTimeSlider)
