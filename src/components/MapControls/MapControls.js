import React from 'react';
import PropTypes from 'prop-types';
import * as classes from './MapControls.scss';
import * as constants from './../../constants';
import Paper from'@material-ui/core/Paper';
import Divider from'@material-ui/core/Divider';
import { RadioGroup, Radio } from'@material-ui/core/Radio';
import AppBar from'@material-ui/core/AppBar';
import IconButton from'@material-ui/core/IconButton';
import MapControlsIcon from '@material-ui/icons/MyLocation';
import MinimizeIcon from '@material-ui/icons/Remove';
import Button from'@material-ui/core/Button';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import ExitFullScreenIcon from '@material-ui/icons/FullscreenExit';

export default class MapControls extends React.Component {
  static propTypes = {
    onToggleMapPanel: PropTypes.func.isRequired,
    selectMapManipulationMode: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      isFullScreen: false
    };
    this._onHideMapControlsPanel = this._onHideMapControlsPanel.bind(this);
    this._onSelectedFullScreenMode = this._onSelectedFullScreenMode.bind(this);
  }

  _onHideMapControlsPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_MAP_CONTROLS_PANEL);
  }

  _onSelectedFullScreenMode() {
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
  }

  render () {
    return (
      <Paper className={classes['MapControls']}>
        <AppBar
          title="Map Controls"
          iconElementLeft={<IconButton><MapControlsIcon /></IconButton>}
          iconElementRight={<IconButton className="cy-minimize-btn" onTouchTap={(event) => this._onHideMapControlsPanel()}><MinimizeIcon /></IconButton>} />
        <div className="container">
          <h4>Mouse Click Mode</h4>
          <RadioGroup
            style={{marginTop: '10px'}}
            onChange={this.props.selectMapManipulationMode}
            name="map-manipulation-mode"
            defaultSelected={constants.VISUALIZE_MODE_VISUALIZE}>
            <Radio id="cy-grid-point-values-btn" value={constants.VISUALIZE_MODE_VISUALIZE} label="Grid Point Values" />
            <Radio id="cy-region-selection-btn" value={constants.VISUALIZE_MODE_JOB_MANAGEMENT} label="Region Selection" />
          </RadioGroup>
          <Divider />
          <h4>Toggle Full Screen Mode</h4>
          <Button variant="contained"
            label="Full screen"
            style={{marginBottom: '10px'}}
            primary={true}
            icon={(!this.state.isFullScreen)? <FullScreenIcon /> :<ExitFullScreenIcon />}
            onTouchTap={this._onSelectedFullScreenMode} />
        </div>
      </Paper>
    );
  }
}
