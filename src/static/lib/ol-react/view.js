import React from 'react';
import PropTypes from 'prop-types';
import ol from 'openlayers';
import OLComponent from './ol-component';

export default class View extends OLComponent {
  constructor(props) {
    super(props);
    this.view = new ol.View();
    //this.view.on("change:center", this.onCenterChanged, this);
    //this.view.on("change:resolution", this.onResolutionChanged, this);
    this.updateFromProps(props);
  }

  onCenterChanged(event) {
    this.props.onNavigation({
      center: this.view.getCenter()
    });
  }

  onResolutionChanged(event) {
    this.props.onNavigation({
      resolution: this.view.getResolution()
    });
    return true;
  }

  updateFromProps(props) {
    this.view.setCenter(props.center);
    this.view.setResolution(props.resolution);
  }

  componentDidMount() {
    this.context.map.setView(this.view);
  }

  componentWillReceiveProps(newProps) {
    this.updateFromProps(newProps);
  }
}

View.propTypes = {
	center: PropTypes.arrayOf(PropTypes.number).isRequired,
	resolution: PropTypes.number.isRequired,
	onNavigation: PropTypes.func
}

View.contextTypes = {
  map: PropTypes.instanceOf(ol.Map)
}
