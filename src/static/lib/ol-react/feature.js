import React from 'react';
import PropTypes from 'prop-types';
import ol from 'openlayers';
import OLComponent from './ol-component';

export default class Feature extends OLComponent {
  constructor(props) {
    super(props);
    this.feature = new ol.Feature({});
    this.feature.setId(props.id);
    this.updateFromProps(props);
  }

  updateFromProps(props) {
    this.feature.setStyle(this.buildStyle(props));
  }

  buildStyle(props) {
    var result;
    if(props.style) {
      result = {};
      if(props.style.fill) {
        result.fill = new ol.style.Fill(props.style.fill);
      }
      if(props.style.stroke) {
        result.stroke = new ol.style.Stroke(props.style.stroke);
      }
      result = new ol.style.Style(result);
    }
    return result;
  }

  getChildContext() {
    return {
      feature: this.feature
    }
  }

  componentDidMount() {
    this.context.source.addFeature(this.feature);
  }

  componentWillReceiveProps(newProps) {
    this.updateFromProps(newProps);
  }
}

Feature.propTypes = {
  style: PropTypes.object,
  children: PropTypes.element,
  id: PropTypes.any.isRequired
}

Feature.contextTypes = {
  source: PropTypes.instanceOf(ol.source.Source)
}

Feature.childContextTypes = {
  feature: PropTypes.instanceOf(ol.Feature)
}
