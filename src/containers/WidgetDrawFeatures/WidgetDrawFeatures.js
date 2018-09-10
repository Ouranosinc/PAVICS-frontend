import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as layerCustomFeatureActions } from '../../redux/modules/LayerCustomFeature';
import WidgetDrawFeatures from './../../components/WidgetDrawFeatures';

const mapStateToProps = (state) => {
  return {
    layerCustomFeature: state.customFeature
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    layerCustomFeatureActions: bindActionCreators({...layerCustomFeatureActions}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetDrawFeatures)
