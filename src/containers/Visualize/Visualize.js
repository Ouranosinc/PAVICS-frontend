import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as layerBasemapActions } from '../../redux/modules/LayerBasemap';
import { actions as widgetsActions } from '../../redux/modules/Widgets';
import Visualize from './../../components/Visualize';

const mapStateToProps = (state) => {
  return {
    widgets: state.widgets
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(
      {
        toggleWidget: widgetsActions.toggleWidget,
        selectBasemap: layerBasemapActions.selectBasemap
      },
      dispatch,
    )
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Visualize)
