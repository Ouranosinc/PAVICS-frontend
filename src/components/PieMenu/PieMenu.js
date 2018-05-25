import React from 'react';
import * as constants from './../../constants';
import classes from './PieMenu.scss';
import AccessTimeIcon from 'material-ui/svg-icons/device/access-time';
import ChartIcon from 'material-ui/svg-icons/action/timeline';
import LayersIcon from 'material-ui/svg-icons/maps/layers';
import MapControlsIcon from 'material-ui/svg-icons/maps/my-location';
import InfoIcon from 'material-ui/svg-icons/action/description';
import {white} from 'material-ui/styles/colors';

const customSvgStyle = {
  'height': '70px',
  'width': '70px',
  'padding': '20px 15px 0 0'
};

export class PieMenu extends React.Component {
  static propTypes = {
    mapPanelStatus: React.PropTypes.object.isRequired,
    onToggleMapPanel: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this._toggleInfoPanel = this._toggleInfoPanel.bind(this);
    this._toggleMapControlsPanel = this._toggleMapControlsPanel.bind(this);
    this._toggleLayerSwitcherPanel = this._toggleLayerSwitcherPanel.bind(this);
    this._toggleChartPanel = this._toggleChartPanel.bind(this);
    this._toggleTimeSliderPanel = this._toggleTimeSliderPanel.bind(this);
  }

  _onClick (event) {
    console.log(event);
  }

  _toggleInfoPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_INFO_PANEL);
  }

  _toggleMapControlsPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_MAP_CONTROLS_PANEL);
  }

  _toggleLayerSwitcherPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_LAYER_SWITCHER_PANEL);
  }

  _toggleChartPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_CHART_PANEL);
  }

  _toggleTimeSliderPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_TIME_SLIDER_PANEL);
  }

  render () {
    return (
      <div className={classes['PieMenu']}>
        <nav className={classes['radialnav']}>
          <ul className={classes['menu']}>
            <li id="cy-menu-point-info-toggle">
              <span>
                <a href="#" onClick={this._toggleInfoPanel} title="Toggle Point Informations"
                   className={this.props.mapPanelStatus[constants.VISUALIZE_INFO_PANEL] ? classes['IsOpen'] : ''}>
                  <span id="cy-menu-point-info-toggle2">
                    <InfoIcon color={white} style={customSvgStyle} />
                  </span>
                </a>
              </span>
            </li>
            <li id="cy-menu-time-series-toggle">
              <a href="#" onClick={this._toggleChartPanel} title="Toggle Time Series Chart"
                 className={this.props.mapPanelStatus[constants.VISUALIZE_CHART_PANEL] ? classes['IsOpen'] : ''}>
                <ChartIcon color={white} style={customSvgStyle} />
              </a>
            </li>
            <li id="cy-menu-layer-switcher-toggle">
              <a href="#" onClick={this._toggleLayerSwitcherPanel} title="Toggle Layer Switcher"
                 className={this.props.mapPanelStatus[constants.VISUALIZE_LAYER_SWITCHER_PANEL] ? classes['IsOpen'] : ''}>
                <LayersIcon color={white} style={customSvgStyle} />
              </a>«
            </li>
            <li id="cy-menu-temporal-slider-toggle">
              <a href="#" onClick={this._toggleTimeSliderPanel} title="Toggle Temporal Slider"
                 className={this.props.mapPanelStatus[constants.VISUALIZE_TIME_SLIDER_PANEL] ? classes['IsOpen'] : ''}>
                <AccessTimeIcon color={white} style={customSvgStyle} />
              </a>
            </li>
            <li id="cy-menu-map-controls-toggle">
              <a href="#" onClick={this._toggleMapControlsPanel} title="Toggle Map Controls"
                 className={this.props.mapPanelStatus[constants.VISUALIZE_MAP_CONTROLS_PANEL] ? classes['IsOpen'] : ''}>
                <MapControlsIcon color={white} style={customSvgStyle} />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
