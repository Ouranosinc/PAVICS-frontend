import React from 'react';
import PropTypes from 'prop-types';

export default class OLComponent extends React.Component {
  render() {
    return <div style={{display: 'none'}}>{this.props.children}</div>;;
  }
}
