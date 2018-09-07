import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as customFeatureActions } from './../../redux/modules/CustomFeature';
import WidgetDrawFeatures from './../../components/WidgetDrawFeatures';

const mapStateToProps = (state) => {
  return {
    customFeature: state.customFeature
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    customFeatureActions: bindActionCreators({...customFeatureActions}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetDrawFeatures)
