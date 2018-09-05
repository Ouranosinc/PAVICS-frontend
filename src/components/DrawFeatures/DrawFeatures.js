import React from 'react';
import PropTypes from 'prop-types';
import * as constants from './../../constants';
import Divider from'@material-ui/core/Divider';
import Radio from'@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from'@material-ui/core/Button';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import ExitFullScreenIcon from '@material-ui/icons/FullscreenExit';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

export default class DrawFeatures extends React.Component {
  static propTypes = {
    visualize: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      name: "",
      description: ""
    };
  }

  onSelectedDrawingTool = (event) => {
    this.props.visualizeActions.setCurrentDrawingTool(event.target.value);
  };

  onResetDrawingLayer = () => {
    this.props.visualizeActions.setDrawnCustomFeatures([]);
  };

  onSaveDrawnLayer = () => {
    this.props.visualizeActions.saveDrawnCustomFeatures([]);
  };

  handleTextFieldChange = (event) => {
    // name or description has changed
    // this.props.handleChange(event.target.value, this.props.uniqueIdentifier);
  };

  render () {
    return (
      <div className="container">
        <FormControl fullWidth>
          <InputLabel htmlFor="cy-drawing-tool">Drawing tool</InputLabel>
          <Select
            inputProps={{
              name: 'cy-drawing-tool'
            }}
            value={this.props.visualize.currentDrawingTool}
            onChange={this.onSelectedDrawingTool}>
            <MenuItem value="">None</MenuItem>
            {
              Object.values(constants.VISUALIZE_DRAW_MODES).map((mode, i) =>
                <MenuItem key={i} value={mode.value}>{mode.label}</MenuItem>
              )
            }
          </Select>
        </FormControl>
        <Button variant="contained"
                color="primary"
                onClick={this.onResetDrawingLayer}>
          Reset
        </Button>
        <Button variant="contained"
                color="secondary"
                onClick={this.onSaveDrawnLayer}>
          Save and upload
        </Button>
        { /*this.props.visualize.geoJSONDrawnFeature*/ }
        <Divider style={{marginBottom: '5px'}} />
        { (this.props.visualize.currentSelectedDrawnFeature) ?
          <React.Fragment>
            <Typography variant="subheading">
              Currently selected polygon
            </Typography>
            <TextField
              fullWidth
              value={this.props.visualize.currentSelectedDrawnFeature.name}
              onChange={this.handleTextFieldChange}
              helperText="Selected feature name"
              label="Feature name" />
            <Divider style={{marginBottom: '5px'}} />
          </React.Fragment>
          : null }
      </div>
    );
  }
}
