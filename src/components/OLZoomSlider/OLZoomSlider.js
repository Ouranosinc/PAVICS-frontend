import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  OLZoomSlider: {

  }
});


export class OLZoomSlider extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <div className={this.props.classes['OLZoomSlider']}>
        <h1>OLZoomSlider</h1>
      </div>
    )
  }
}

export default withStyles(styles)(OLZoomSlider);
