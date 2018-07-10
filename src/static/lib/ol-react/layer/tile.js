import React from 'react';
import PropTypes from 'prop-types';
import ol from 'openlayers';
import OLComponent from '../ol-component';

export default class Tile extends OLComponent {
  constructor(props) {
    super(props);
    this.layer = new ol.layer.Tile()
  }

  getChildContext() {
    return {
      layer: this.layer
    }
  }

  componentDidMount() {
    this.context.map.addLayer(this.layer);
  }
}

Tile.propTypes = {
}

Tile.contextTypes = {
  map: PropTypes.instanceOf(ol.Map)
}

Tile.childContextTypes = {
  layer: PropTypes.instanceOf(ol.layer.Tile)
}
