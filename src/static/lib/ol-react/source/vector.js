import React from 'react';
import PropTypes from 'prop-types';
import ol from 'openlayers';
import OLComponent from '../ol-component';
import * as interaction from '../interaction';

export default class Vector extends OLComponent {
  constructor(props) {
    super(props);
    this.source = new ol.source.Vector(
      Object.assign({
        features: new ol.Collection()
      }, this.props)
    );
  }

  getChildContext() {
    return {
      source: this.source
    }
  }

  componentDidMount() {
    this.context.layer.setSource(this.source);
    this.context.map.addInteraction(
      new interaction.Modify({
        features: this.source.getFeaturesCollection(),
        onModifyEnd: this.props.actions.onModifyEnd,
      })
    );
  }
}

Vector.propTypes = {
  actions: PropTypes.object.isRequired
}

Vector.contextTypes = {
  layer: PropTypes.instanceOf(ol.layer.Base),
  map: PropTypes.instanceOf(ol.Map)
}

Vector.childContextTypes = {
  source: PropTypes.instanceOf(ol.source.Source)
}
