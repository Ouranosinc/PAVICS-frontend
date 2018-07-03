import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import * as constants from './../../constants';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
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
    open: false,
    hidden: false,
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
    const { hidden, open } = this.state;

    return (
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        className={classes.speedDial}
        hidden={hidden}
        icon={<SpeedDialIcon openIcon={<OpenInBrowserIcon />} />}
        onBlur={this.handleClose}
        onClick={this.handleClick}
        onClose={this.handleClose}
        onFocus={this.handleOpen}
        onMouseEnter={this.handleOpen}
        onMouseLeave={this.handleClose}
        open={open}
      >
        <SpeedDialAction
          classeName={this.props.mapPanelStatus[constants.VISUALIZE_MAP_CONTROLS_PANEL]? this.props.classes.isOpen: this.props.classes.isClose}
          style={{backgroundColor: 'blue'}}
          icon={<MapControlsIcon className={this.props.classes.white} />}
          tooltipTitle={constants.VISUALIZE_MAP_CONTROLS_PANEL}
          onClick={(event) => this.toggleMapControlsPanel()}
          ButtonProps={{
            color: this.props.mapPanelStatus[constants.VISUALIZE_MAP_CONTROLS_PANEL]? 'primary': 'secondary'
          }}
        />
        <SpeedDialAction
          icon={<AccessTimeIcon className={this.props.classes.white}/>}
          tooltipTitle={constants.VISUALIZE_TIME_SLIDER_PANEL}
          onClick={(event) => this.toggleTimeSliderPanel()}
          ButtonProps={{
            color: this.props.mapPanelStatus[constants.VISUALIZE_TIME_SLIDER_PANEL]? 'primary': 'secondary'
          }}
        />
        <SpeedDialAction
          icon={<LayersIcon className={this.props.classes.white}/>}
          tooltipTitle={constants.VISUALIZE_LAYER_SWITCHER_PANEL}
          onClick={(event) => this.toggleLayerSwitcherPanel()}
          ButtonProps={{
            color: this.props.mapPanelStatus[constants.VISUALIZE_LAYER_SWITCHER_PANEL]? 'primary': 'secondary'
          }}
        />
        <SpeedDialAction
          icon={<ChartIcon className={this.props.classes.white}/>}
          tooltipTitle={constants.VISUALIZE_CHART_PANEL}
          onClick={(event) => this.toggleChartPanel()}
          ButtonProps={{
            color: this.props.mapPanelStatus[constants.VISUALIZE_CHART_PANEL]? 'primary': 'secondary'
          }}
        />
        <SpeedDialAction
          icon={<InfoIcon className={this.props.classes.white}/>}
          tooltipTitle={constants.VISUALIZE_INFO_PANEL}
          onClick={(event) => this.toggleInfoPanel()}
          ButtonProps={{
            color: this.props.mapPanelStatus[constants.VISUALIZE_INFO_PANEL]? 'primary': 'secondary'
          }}
        />
      </SpeedDial>
    );
  }
}

export default withStyles(styles)(SpeedDialMenu);
