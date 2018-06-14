import React from 'react';
import PropTypes from 'prop-types';
import ol from 'openlayers';
import OLComponent from '../ol-component';

export default class LineString extends OLComponent {
  constructor(props) {
    super(props);
    this.geometry = new ol.geom.LineString();
    this.updateFromProps(props);
  }

  updateFromProps(props) {
    this.geometry.setCoordinates(props.children);
  }

  componentDidMount() {
    this.context.feature.setGeometry(this.geometry);
  }

  componentWillReceiveProps(newProps) {
    this.updateFromProps(newProps);
  }
}

LineString.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.number)
  ).isRequired,
}

LineString.contextTypes = {
  feature: PropTypes.instanceOf(ol.Feature)
}
