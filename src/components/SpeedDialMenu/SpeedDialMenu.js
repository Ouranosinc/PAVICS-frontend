import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import * as constants from './../../constants';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ChartIcon from '@material-ui/icons/Timeline';
import LayersIcon from '@material-ui/icons/Layers';
import MapControlsIcon from '@material-ui/icons/MyLocation';
import InfoIcon from '@material-ui/icons/Description';

const styles = theme => {
  console.log(theme)
  return ({
    speedDial: {
      position: 'fixed',
      bottom: theme.spacing.unit * 5,
      left: theme.spacing.unit * 5,
    },
    white: {
      color: theme.palette.primary.contrastText
    },
  })
};

class SpeedDialMenu extends React.Component {
  state = {
    open: false
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    mapPanelStatus: PropTypes.object.isRequired,
    onToggleMapPanel: PropTypes.func.isRequired
  };

  handleClick = () => {
    this.setState(state => ({
      open: !state.open,
    }));
  };

  handleOpen = () => {
    if (!this.state.hidden) {
      this.setState({
        open: true,
      });
    }
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  toggleInfoPanel = () => {
    this.props.onToggleMapPanel(constants.VISUALIZE_INFO_PANEL);
  };

  toggleMapControlsPanel = () => {
    this.props.onToggleMapPanel(constants.VISUALIZE_MAP_CONTROLS_PANEL);
  };

  toggleLayerSwitcherPanel = () => {
    this.props.onToggleMapPanel(constants.VISUALIZE_LAYER_SWITCHER_PANEL);
  };

  toggleChartPanel = () => {
    this.props.onToggleMapPanel(constants.VISUALIZE_CHART_PANEL);
  };

  toggleTimeSliderPanel = () => {
    this.props.onToggleMapPanel(constants.VISUALIZE_TIME_SLIDER_PANEL);
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        className={classes.speedDial}
        icon={<SpeedDialIcon openIcon={<VisibilityIcon />} />}
        onBlur={this.handleClose}
        onClick={this.handleClick}
        onClose={this.handleClose}
        onFocus={this.handleOpen}
        onMouseEnter={this.handleOpen}
        onMouseLeave={this.handleClose}
        ButtonProps={{
          id: "cy-speed-dial-menu-btn"
        }}
        open={open}>
        <SpeedDialAction
          icon={<MapControlsIcon className={classes.white} />}
          tooltipTitle={constants.VISUALIZE_MAP_CONTROLS_PANEL}
          onClick={(event) => this.toggleMapControlsPanel()}
          ButtonProps={{
            id: "cy-menu-map-controls-toggle-btn",
            color: this.props.mapPanelStatus[constants.VISUALIZE_MAP_CONTROLS_PANEL]? 'primary': 'secondary'
          }} />
        <SpeedDialAction
          icon={<AccessTimeIcon className={classes.white}/>}
          tooltipTitle={constants.VISUALIZE_TIME_SLIDER_PANEL}
          onClick={(event) => this.toggleTimeSliderPanel()}
          ButtonProps={{
            id: "cy-menu-temporal-slider-toggle-btn",
            color: this.props.mapPanelStatus[constants.VISUALIZE_TIME_SLIDER_PANEL]? 'primary': 'secondary'
          }} />
        <SpeedDialAction
          icon={<LayersIcon className={classes.white}/>}
          tooltipTitle={constants.VISUALIZE_LAYER_SWITCHER_PANEL}
          onClick={(event) => this.toggleLayerSwitcherPanel()}
          ButtonProps={{
            id: "cy-menu-layer-switcher-toggle-btn",
            color: this.props.mapPanelStatus[constants.VISUALIZE_LAYER_SWITCHER_PANEL]? 'primary': 'secondary'
          }} />
        <SpeedDialAction
          icon={<ChartIcon className={classes.white}/>}
          tooltipTitle={constants.VISUALIZE_CHART_PANEL}
          onClick={(event) => this.toggleChartPanel()}
          ButtonProps={{
            id: "cy-menu-time-series-toggle-btn",
            color: this.props.mapPanelStatus[constants.VISUALIZE_CHART_PANEL]? 'primary': 'secondary'
          }} />
        <SpeedDialAction
          icon={<InfoIcon className={classes.white}/>}
          tooltipTitle={constants.VISUALIZE_INFO_PANEL}
          onClick={(event) => this.toggleInfoPanel()}
          ButtonProps={{
            id: "cy-menu-point-info-toggle-btn",
            color: this.props.mapPanelStatus[constants.VISUALIZE_INFO_PANEL]? 'primary': 'secondary'
          }} />
      </SpeedDial>
    );
  }
}

export default withStyles(styles)(SpeedDialMenu);
