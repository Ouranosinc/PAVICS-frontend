import React from 'react';
import PropTypes from 'prop-types';
import * as constants from './../../constants';
import Divider from'@material-ui/core/Divider';
import Radio from'@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from'@material-ui/core/Button';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import ExitFullScreenIcon from '@material-ui/icons/FullscreenExit';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

export default class MapControls extends React.Component {
  static propTypes = {
    visualize: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      isFullScreen: false
    };
  }

  onSelectedFullScreenMode = () => {
    if (!this.state.isFullScreen) {
      let el = document.documentElement;
      let rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      rfs.call(el);
    }else {
      if (document.exitFullscreen)
        document.exitFullscreen();
      else if (document.msExitFullscreen)
        document.msExitFullscreen();
      else if (document.mozCancelFullScreen)
        document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen)
        document.webkitExitFullscreen();
    }
    this.setState({
      isFullScreen: !this.state.isFullScreen
    });
  };

  onSelectMapManipulationMode = (event, value) => {
    this.props.visualizeActions.selectMapManipulationMode(value);
  };

  render () {
    return (
      <div className="container">
        <Typography variant="subheading">
          Mouse Click Mode
        </Typography>
        <RadioGroup
          style={{marginTop: '10px'}}
          onChange={this.onSelectMapManipulationMode}
          name="map-manipulation-mode"
          value={this.props.visualize.mapManipulationMode}>
          <FormControlLabel
            id="cy-grid-point-values-btn"
            label="Grid Point Values"
            value={constants.VISUALIZE_MODE_GRID_VALUES}
            control={
              <Radio color="primary" />
            } />
          <FormControlLabel
            id="cy-region-selection-btn"
            value={constants.VISUALIZE_MODE_REGION_SELECTION}
            label="Region Selection"
            control={
              <Radio color="primary" />
            }/>
        </RadioGroup>
        <Divider style={{marginBottom: '5px'}} />
        <Typography variant="subheading">
          Toggle Full Screen Mode
        </Typography>
        <Button variant="contained"
          style={{marginBottom: '10px'}}
          color="primary"
          onClick={this.onSelectedFullScreenMode}>
          Full screen
          {(!this.state.isFullScreen)? <FullScreenIcon /> :<ExitFullScreenIcon />}
        </Button>
      </div>
    );
  }
}
