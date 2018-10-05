import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as visualizeActions } from '../../redux/modules/Visualize';
import WidgetTimeSeries from './../../components/WidgetTimeSeries';

const mapStateToProps = (state) => {
  return {
    currentDisplayedDataset: state.layerDataset.currentDisplayedDataset,
    currentScalarValue: state.visualize.currentScalarValue,
    plotlyData: state.visualize.plotlyData
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(
      {
        fetchPlotlyData: visualizeActions.fetchPlotlyData
      },
      dispatch,
    )
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetTimeSeries)
