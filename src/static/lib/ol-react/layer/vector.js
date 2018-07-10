import React from 'react';
import PropTypes from 'prop-types';
import ol from 'openlayers';
import OLComponent from '../ol-component';

export default class Vector extends OLComponent {
  constructor(props) {
    super(props);
    this.layer = new ol.layer.Vector({
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: [0, 0, 255, 0.6]
        })
      })
    });
  }

  getChildContext() {
    return {
      layer: this.layer,
      map: this.context.map
    }
  }

  componentDidMount() {
    this.context.map.addLayer(this.layer);
  }
}

Vector.propTypes = {
}

Vector.contextTypes = {
  map: PropTypes.instanceOf(ol.Map)
}

Vector.childContextTypes = {
  layer: PropTypes.instanceOf(ol.layer.Vector),
  map: PropTypes.instanceOf(ol.Map)
}
