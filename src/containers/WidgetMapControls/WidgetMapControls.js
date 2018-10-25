import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as visualizeActions } from '../../redux/modules/Visualize';
import WidgetMapControls from './../../components/WidgetMapControls';

const mapStateToProps = (state) => {
  return {
    mapManipulationMode: state.visualize.mapManipulationMode
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(
      {
        selectMapManipulationMode: visualizeActions.selectMapManipulationMode
      },
      dispatch,
    )
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetMapControls)
