import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import WidgetPointInformations from './../../components/WidgetPointInformations'

const mapStateToProps = (state) => {
  return {
    currentScalarValue: state.visualize.currentScalarValue
  }
};
const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetPointInformations)
