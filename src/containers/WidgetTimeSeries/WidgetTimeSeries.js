import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import WidgetTimeSeries from './../../components/WidgetTimeSeries';
import { actions as visualiseActions } from './../../redux/modules/Visualize';

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
        fetchPlotlyData: visualiseActions.fetchPlotlyData
      },
      dispatch,
    )
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetTimeSeries)
