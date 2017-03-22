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

export default class MapControls extends React.Component {
  static propTypes = {
    onToggleMapPanel: React.PropTypes.func.isRequired,
    selectMapManipulationMode: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._onHideMapControlsPanel = this._onHideMapControlsPanel.bind(this);
  }

  _onHideMapControlsPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_MAP_CONTROLS_PANEL);
  }

  render () {
    return (
      <Paper className={classes['MapControls']}>
        <AppBar
          title="Map Controls"
          iconElementLeft={<IconButton><MapControlsIcon /></IconButton>}
          iconElementRight={<IconButton><MinimizeIcon onTouchTap={(event) => this._onHideMapControlsPanel()} /></IconButton>} />
        <h4>Mouse Click Mode</h4>
        <Divider />
        <RadioButtonGroup
          style={{marginTop: '10px'}}
          onChange={this.props.selectMapManipulationMode}
          name="map-manipulation-mode"
          defaultSelected={constants.VISUALIZE_MODE_VISUALIZE}>
          <RadioButton value={constants.VISUALIZE_MODE_VISUALIZE} label="Point scalar values" />
          <RadioButton value={constants.VISUALIZE_MODE_JOB_MANAGEMENT} label="Region Selection" />
        </RadioButtonGroup>
      </Paper>
    );
  }
}
