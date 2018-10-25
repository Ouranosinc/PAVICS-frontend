import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
<<<<<<< HEAD
import WidgetTimeSeries from './../../components/WidgetTimeSeries';
import { actions as visualiseActions } from './../../redux/modules/Visualize';
=======
import { actions as visualizeActions } from '../../redux/modules/Visualize';
import WidgetTimeSeries from './../../components/WidgetTimeSeries';
>>>>>>> drawn-features-to-binary-format

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
<<<<<<< HEAD
        fetchPlotlyData: visualiseActions.fetchPlotlyData
=======
        fetchPlotlyData: visualizeActions.fetchPlotlyData
>>>>>>> drawn-features-to-binary-format
      },
      dispatch,
    )
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetTimeSeries)
