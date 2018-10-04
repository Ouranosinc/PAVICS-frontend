import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Map from 'ol/Map';
import { ScaleLine } from 'ol/control';

export class OLScaleLine extends React.Component {
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
    map.addControl(new ScaleLine());
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
)(OLScaleLine)
