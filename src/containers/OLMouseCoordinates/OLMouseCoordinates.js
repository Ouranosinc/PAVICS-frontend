import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Map from 'ol/Map';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';

export class OLMouseCoordinates extends React.Component {
  static propTypes = {
    map: PropTypes.instanceOf(Map)
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

  init(map) {
    let mousePosition = new MousePosition({
      coordinateFormat: createStringXY(6),
      projection: 'EPSG:4326',
      target: document.getElementById('mouseCoordinates')
    });
    map.addControl(mousePosition);
  }


  render () {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {}
};
const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OLMouseCoordinates)
