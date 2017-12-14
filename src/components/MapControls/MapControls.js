import React from 'react';
import * as classes from './MapControls.scss';
import * as constants from './../../constants';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { RadioButtonGroup, RadioButton } from 'material-ui/RadioButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MapControlsIcon from 'material-ui/svg-icons/maps/my-location';
import MinimizeIcon from 'material-ui/svg-icons/content/remove';
import RaisedButton from 'material-ui/RaisedButton';
import FullScreenIcon from 'material-ui/svg-icons/navigation/fullscreen';
import ExitFullScreenIcon from 'material-ui/svg-icons/navigation/fullscreen-exit';

export default class MapControls extends React.Component {
  static propTypes = {
    onToggleMapPanel: React.PropTypes.func.isRequired,
    selectMapManipulationMode: React.PropTypes.func.isRequired
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
          iconElementRight={<IconButton><MinimizeIcon onTouchTap={(event) => this._onHideMapControlsPanel()} /></IconButton>} />
        <div className="container">
          <h4>Mouse Click Mode</h4>
          <RadioButtonGroup
            style={{marginTop: '10px'}}
            onChange={this.props.selectMapManipulationMode}
            name="map-manipulation-mode"
            defaultSelected={constants.VISUALIZE_MODE_VISUALIZE}>
            <RadioButton value={constants.VISUALIZE_MODE_VISUALIZE} label="Grid Point Values" />
            <RadioButton value={constants.VISUALIZE_MODE_JOB_MANAGEMENT} label="Region Selection" />
          </RadioButtonGroup>
          <Divider />
          <h4>Toggle Full Screen Mode</h4>
          <RaisedButton
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
