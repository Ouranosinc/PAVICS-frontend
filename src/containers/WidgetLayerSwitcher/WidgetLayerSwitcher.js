import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as regionActions } from './../../redux/modules/Region';
import { actions as visualizeActions } from './../../redux/modules/Visualize';
import LayerSwitcher from './../../components/LayerSwitcher';

const mapStateToProps = (state) => {
  return {
    region: state.region,
    visualize: state.visualize
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    regionActions: bindActionCreators({...regionActions}, dispatch),
    visualizeActions: bindActionCreators({...visualizeActions}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerSwitcher)
