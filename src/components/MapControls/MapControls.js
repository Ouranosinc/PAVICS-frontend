import React from 'react';
import PropTypes from 'prop-types';
import * as classes from './MapControls.scss';
import * as constants from './../../constants';
import Paper from'@material-ui/core/Paper';
import Divider from'@material-ui/core/Divider';
import Radio from'@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import AppBar from'@material-ui/core/AppBar';
import IconButton from'@material-ui/core/IconButton';
import MapControlsIcon from '@material-ui/icons/MyLocation';
import MinimizeIcon from '@material-ui/icons/Remove';
import Button from'@material-ui/core/Button';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import ExitFullScreenIcon from '@material-ui/icons/FullscreenExit';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class MapControls extends React.Component {
  static propTypes = {
    onMinimizeClicked: PropTypes.func.isRequired,
    visualize: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      isFullScreen: false
    };
    this._onSelectedFullScreenMode = this._onSelectedFullScreenMode.bind(this);
    this._onSelectMapManipulationMode = this._onSelectMapManipulationMode.bind(this);
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

  _onSelectMapManipulationMode(event, value) {
    this.props.visualizeActions.selectMapManipulationMode(value);
  }

  render () {
    return (
      <Paper className={classes['MapControls']}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton disableRipple color="inherit"><MapControlsIcon /></IconButton>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              {constants.VISUALIZE_MAP_CONTROLS_PANEL}
            </Typography>
            <IconButton color="inherit" className="cy-minimize-btn" onClick={(event) => this.props.onMinimizeClicked()}><MinimizeIcon /></IconButton>
          </Toolbar>
        </AppBar>
        <div className="container">
          <h4>Mouse Click Mode</h4>
          <RadioGroup
            style={{marginTop: '10px'}}
            onChange={this._onSelectMapManipulationMode}
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
          <Divider />
          <h4>Toggle Full Screen Mode</h4>
          <Button variant="contained"
            style={{marginBottom: '10px'}}
            color="primary"
            onClick={this._onSelectedFullScreenMode}>
            Full screen
            {(!this.state.isFullScreen)? <FullScreenIcon /> :<ExitFullScreenIcon />}
          </Button>
        </div>
      </Paper>
    );
  }
}
