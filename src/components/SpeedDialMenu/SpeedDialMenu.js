import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { constants } from './../../redux/modules/Widgets';
import * as labels from './../../constants';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ChartIcon from '@material-ui/icons/Timeline';
import LayersIcon from '@material-ui/icons/Layers';
import MapControlsIcon from '@material-ui/icons/MyLocation';
import InfoIcon from '@material-ui/icons/Description';
import DrawIcon from '@material-ui/icons/EditLocation'

const styles = theme => {
  // console.log(theme)
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
  wrapperRef = null;

  static propTypes = {
    classes: PropTypes.object.isRequired,
    widgets: PropTypes.object.isRequired,
    widgetsActions: PropTypes.object.isRequired
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onToggleClicked = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  handleClickOutside = (event) => {
    // If clicking outside the popover when its open, close it
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({open: false});
    }
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <div ref={this.setWrapperRef}>
        <SpeedDial
          ariaLabel="SpeedDial openIcon example"
          className={classes.speedDial}
          icon={<SpeedDialIcon openIcon={<VisibilityIcon />} />}
          onClick={this.onToggleClicked}
          ButtonProps={{
            id: "cy-speed-dial-menu-btn"
          }}
          open={open}>
          <SpeedDialAction
            icon={<LayersIcon className={classes.white}/>}
            tooltipTitle={labels.LAYER_SWITCHER_WIDGET_TITLE}
            onClick={(event) => this.props.widgetsActions.toggleWidget(constants.WIDGET_LAYER_SWITCHER_KEY)}
            ButtonProps={{
              id: "cy-menu-layer-switcher-toggle-btn",
              color: this.props.widgets.layerSwitcher? 'primary': 'secondary'
            }} />
          <SpeedDialAction
            icon={<MapControlsIcon className={classes.white} />}
            tooltipTitle={labels.MAP_CONTROLS_WIDGET_TITLE}
            onClick={(event) => this.props.widgetsActions.toggleWidget(constants.WIDGET_MAP_CONTROLS_KEY)}
            ButtonProps={{
              id: "cy-menu-map-controls-toggle-btn",
              color: this.props.widgets.mapControls? 'primary': 'secondary'
            }} />
          <SpeedDialAction
            icon={<AccessTimeIcon className={classes.white}/>}
            tooltipTitle={labels.TIME_SLIDER_WIDGET_TITLE}
            onClick={(event) => this.props.widgetsActions.toggleWidget(constants.WIDGET_TIME_SLIDER_KEY)}
            ButtonProps={{
              id: "cy-menu-temporal-slider-toggle-btn",
              color: this.props.widgets.timeSlider? 'primary': 'secondary'
            }} />
          <SpeedDialAction
            icon={<ChartIcon className={classes.white}/>}
            tooltipTitle={labels.CHART_WIDGET_TITLE}
            onClick={(event) => this.props.widgetsActions.toggleWidget(constants.WIDGET_CHART_KEY)}
            ButtonProps={{
              id: "cy-menu-time-series-toggle-btn",
              color: this.props.widgets.chart? 'primary': 'secondary'
            }} />
          <SpeedDialAction
            icon={<InfoIcon className={classes.white}/>}
            tooltipTitle={labels.INFO_WIDGET_TITLE}
            onClick={(event) => this.props.widgetsActions.toggleWidget(constants.WIDGET_INFO_KEY)}
            ButtonProps={{
              id: "cy-menu-point-info-toggle-btn",
              color: this.props.widgets.info? 'primary': 'secondary'
            }} />
          <SpeedDialAction
            icon={<DrawIcon className={classes.white}/>}
            tooltipTitle={labels.CUSTOM_REGIONS_WIDGET_TITLE}
            onClick={(event) => this.props.widgetsActions.toggleWidget(constants.WIDGET_CUSTOM_REGIONS_KEY)}
            ButtonProps={{
              id: "cy-menu-custom-regions-toggle-btn",
              color: this.props.widgets.customRegions? 'primary': 'secondary'
            }} />
        </SpeedDial>
      </div>
    );
  }
}

export default withStyles(styles)(SpeedDialMenu);
