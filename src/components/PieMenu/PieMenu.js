import React from 'react';
import { Glyphicon } from 'react-bootstrap';
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
    this._toggleMapPanel = this._toggleMapPanel.bind(this);
    this._toggleMapControlsPanel = this._toggleMapControlsPanel.bind(this);
    this._toggleLayerSwitcherPanel = this._toggleLayerSwitcherPanel.bind(this);
    this._toggleChartPanel = this._toggleChartPanel.bind(this);
    this._toggleTimeSliderPanel = this._toggleTimeSliderPanel.bind(this);
  }

  _onClick (event) {
    console.log(event);
  }

  _toggleMapPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_MAP_PANEL);
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
          {/*<a href="#" className='ellipsis'>
            <MenuIcon color={white} />
          </a>*/}
          <ul className={classes['menu']}>
            <li>
              <a href="#" className={this.props.mapPanelStatus[constants.VISUALIZE_MAP_PANEL] ? classes['IsOpen'] : ''}>
                <InfoIcon color={white} style={customSvgStyle} />
              </a>
            </li>
            <li>
              <a href="#" onClick={this._toggleChartPanel} className={this.props.mapPanelStatus[constants.VISUALIZE_CHART_PANEL] ? classes['IsOpen'] : ''}>
                <ChartIcon color={white} style={customSvgStyle} />
              </a>
            </li>
            <li>
              <a href="#" onClick={this._toggleLayerSwitcherPanel} className={this.props.mapPanelStatus[constants.VISUALIZE_LAYER_SWITCHER_PANEL] ? classes['IsOpen'] : ''}>
                <LayersIcon color={white} style={customSvgStyle} />
              </a>
            </li>
            <li>
              <a href="#" onClick={this._toggleTimeSliderPanel} className={this.props.mapPanelStatus[constants.VISUALIZE_TIME_SLIDER_PANEL] ? classes['IsOpen'] : ''}>
                <AccessTimeIcon color={white} style={customSvgStyle} />
              </a>
            </li>
            <li>
              <a href="#" onClick={this._toggleMapControlsPanel} className={this.props.mapPanelStatus[constants.VISUALIZE_MAP_CONTROLS_PANEL] ? classes['IsOpen'] : ''}>
                <MapControlsIcon color={white} style={customSvgStyle} />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
