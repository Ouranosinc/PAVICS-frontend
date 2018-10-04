import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import WidgetPointInformations from './../../containers/WidgetPointInformations'

const mapStateToProps = (state) => {
  return {
    visualize: state.visualize
  }
};
const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetPointInformations)
