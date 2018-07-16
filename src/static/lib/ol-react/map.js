import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import ol from 'openlayers';
import OLComponent from './ol-component';
import * as interaction from './interaction';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.map = new ol.Map({
      interactions: [
        new interaction.DragPan(this.onDrag.bind(this)),
        new interaction.MouseWheelZoom(this.onZoom.bind(this)),
        new interaction.Draw(this.onDrawEnd.bind(this))
      ]
    });
  }

  onDrag(newCenter) {
    this.props.actions.onNavigation({
      center: newCenter
    });
  }

  onZoom(newResolution) {
    this.props.actions.onNavigation({
      resolution: newResolution
    });
  }

  onDrawEnd(newFeature) {
    this.props.actions.onNewFeature(newFeature);
  }

  componentDidMount() {
    this.map.setTarget(this.refs.target);
  }

  getChildContext() {
    return {
      map: this.map
    };
  }

  render() {
    return (
      <React.Fragment>
        <div ref="target">
        </div>
        <React.Fragment>
          {this.props.children}
          {this.props.view}
        </React.Fragment>
      </React.Fragment>
    );
  }
}

Map.propTypes = {
  view: PropTypes.element.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  actions: PropTypes.object.isRequired
}

Map.childContextTypes = {
  map: PropTypes.instanceOf(ol.Map)
}
