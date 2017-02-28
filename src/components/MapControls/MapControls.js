import React from 'react';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { RadioButtonGroup, RadioButton } from 'material-ui/RadioButton'
import * as classes from './MapControls.scss';
import * as constants from './../../constants';
export default class MapControls extends React.Component {
  static propTypes = {
    selectMapManipulationMode: React.PropTypes.func.isRequired
  };
  render () {
    return (
      <Paper className={classes['MapControls']}>
        <h2>Select Map Manipulation Mode</h2>
        <Divider />
        <RadioButtonGroup
          style={{marginTop: '10px'}}
          onChange={this.props.selectMapManipulationMode}
          name="map-manipulation-mode"
          defaultSelected={constants.VISUALIZE_MODE_VISUALIZE}>
          <RadioButton value={constants.VISUALIZE_MODE_VISUALIZE} label="Visualization" />
          <RadioButton value={constants.VISUALIZE_MODE_REGION_SELECTION} label="Region Selection" />
        </RadioButtonGroup>
      </Paper>
    );
  }
}
