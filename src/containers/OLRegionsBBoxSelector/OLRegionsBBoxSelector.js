import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Map from 'ol/Map';
import { DragBox } from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';
import { Fill, Stroke, Style } from 'ol/style';

export class OLRegionsClickSelector extends React.Component {
  static propTypes = {
    map: PropTypes.instanceOf(Map),
    queryGeoserverFeatures: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps (nextProps) {
    const { map } = nextProps;
    if (map !== this.props.map) {
      this.init(map); // Once, when map has been initialised
    }
  }

  init (map) {
    // a DragBox interaction used to select features by drawing boxes
    // Ctrl + drag mouse
    let dragBox = new DragBox({
      condition: platformModifierKeyOnly,
      style: new Style({
        stroke: new Stroke({ color: 'rgba(255,255,255,0.7)' }),
        fill: new Fill({ color: 'rgba(255,255,255,0.3)' })
      })
    });
    map.addInteraction(dragBox);
    dragBox.on('boxend', () => this.onDragBoxEnd(dragBox));
    // Could clear selection when drawing a new box and when clicking on the map ?
    dragBox.on('boxstart', () => {});
  }

  onDragBoxEnd(dragBox) {
    let extent = dragBox.getGeometry().getExtent();
    this.props.queryGeoserverFeatures(extent);
  };


  render () {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OLRegionsClickSelector)
