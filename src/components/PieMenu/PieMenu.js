import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import classes from './PieMenu.scss';
import AccessTimeIcon from 'material-ui/svg-icons/device/access-time';
import InsertChartIcon from 'material-ui/svg-icons/editor/insert-chart';
import LayersIcon from 'material-ui/svg-icons/maps/layers';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MyLocationIcon from 'material-ui/svg-icons/maps/my-location';
import {white} from 'material-ui/styles/colors';

const customSvgStyle = {
  'height': '70px',
  'width': '70px',
  'padding': '20px 15px 0 0'
};

export const CHART_PANEL = 'CHART_PANEL';
export const LAYER_SWITCHER_PANEL = 'LAYER_SWITCHER_PANEL';
export const MAP_PANEL = 'MAP_PANEL';
export const MAP_CONTROLS_PANEL = 'MAP_CONTROLS_PANEL';
export const TIME_SLIDER_PANEL = 'TIME_SLIDER_PANEL';

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
    this.props.onToggleMapPanel(MAP_PANEL);
  }

  _toggleMapControlsPanel () {
    this.props.onToggleMapPanel(MAP_CONTROLS_PANEL);
  }

  _toggleLayerSwitcherPanel () {
    this.props.onToggleMapPanel(LAYER_SWITCHER_PANEL);
  }

  _toggleChartPanel () {
    this.props.onToggleMapPanel(CHART_PANEL);
  }

  _toggleTimeSliderPanel () {
    this.props.onToggleMapPanel(TIME_SLIDER_PANEL);
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
              <a href="#" onClick={this._toggleMapPanel} className={this.props.mapPanelStatus[MAP_PANEL] ? classes['IsOpen'] : ''}>
                <Glyphicon className={classes['CustomGlyphIcon']} glyph="globe" />
              </a>
            </li>
            <li>
              <a href="#" onClick={this._toggleMapControlsPanel} className={this.props.mapPanelStatus[MAP_CONTROLS_PANEL] ? classes['IsOpen'] : ''}>
                <MyLocationIcon color={white} style={customSvgStyle} />
              </a>
            </li>
            <li>
              <a href="#" onClick={this._toggleLayerSwitcherPanel} className={this.props.mapPanelStatus[LAYER_SWITCHER_PANEL] ? classes['IsOpen'] : ''}>
                <LayersIcon color={white} style={customSvgStyle} />
              </a>
            </li>
            <li>
              <a href="#" onClick={this._toggleChartPanel} className={this.props.mapPanelStatus[CHART_PANEL] ? classes['IsOpen'] : ''}>
                <InsertChartIcon color={white} style={customSvgStyle} />
              </a>
            </li>
            <li>
              <a href="#" onClick={this._toggleTimeSliderPanel} className={this.props.mapPanelStatus[TIME_SLIDER_PANEL] ? classes['IsOpen'] : ''}>
                <AccessTimeIcon color={white} style={customSvgStyle} />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
