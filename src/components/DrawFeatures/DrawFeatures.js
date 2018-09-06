import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { VISUALIZE_DRAW_MODES } from './../../constants';
import Divider from'@material-ui/core/Divider';
import Button from'@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { GeoJSON } from 'ol/format';
import { actions as customFeatureActions } from './../../redux/modules/CustomFeature';

const styles = theme => ({
  root: {

  }
});

const mapStateToProps = (state) => {
  return {
    customFeature: state.customFeature
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    customFeatureActions: bindActionCreators({...customFeatureActions}, dispatch),
  };
};

class DrawFeatures extends React.Component {
  static propTypes = {
    customFeature: PropTypes.object.isRequired,
    customFeatureActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      name: "",
      description: ""
    };
  }

  onSelectedDrawingTool = (event) => {
    this.props.customFeatureActions.setCurrentDrawingTool(event.target.value);
  };

  onResetDrawingLayer = () => {
    this.props.customFeatureActions.setDrawnCustomFeatures([]);
  };

  onSaveDrawnLayer = () => {
    const geoJSONriter= new GeoJSON();
    const geoJSONString = geoJSONriter.writeFeatures(this.props.customFeature.drawnCustomFeatures);
    this.props.customFeatureActions.setGeoJSONDrawnFeatures(geoJSONString);
  };

  onNameChanged = (event) => {
    this.setState({
      name: event.target.value
    }, () => {
      // Notify redux
    })
  };

  onDescriptionChanged = (event) => {
    this.setState({
      description: event.target.value
    }, () => {
      // Notify redux
    })
  };

  render () {
    const { currentDrawingTool, currentSelectedDrawnFeature } = this.props.customFeature;
    return (
      <div className="container">
        <FormControl fullWidth>
          <InputLabel htmlFor="cy-drawing-tool">Drawing tool</InputLabel>
          <Select
            inputProps={{
              name: 'cy-drawing-tool'
            }}
            value={currentDrawingTool}
            onChange={this.onSelectedDrawingTool}>
            <MenuItem value="">None</MenuItem>
            {
              Object.values(VISUALIZE_DRAW_MODES).map((mode, i) =>
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
        <Button style={{marginLeft: '15px'}}
                variant="contained"
                color="secondary"
                onClick={this.onSaveDrawnLayer}>
          Save and upload
        </Button>
        { /*this.props.customFeature.geoJSONDrawnFeature*/ }
        <Divider style={{margin: '15px 0'}} />
        <Typography variant="subheading">
          Currently selected custom region
        </Typography>
        <TextField
          fullWidth
          disabled={!currentSelectedDrawnFeature}
          value={(currentSelectedDrawnFeature)?currentSelectedDrawnFeature.name: ''}
          onChange={this.onNameChanged}
          label="Selected feature name" />
        <TextField
          fullWidth
          disabled={!currentSelectedDrawnFeature}
          value={(currentSelectedDrawnFeature)?currentSelectedDrawnFeature.description: ''}
          onChange={this.onDescriptionChanged}
          label="Selected feature description" />
      </div>
    );
  }
}

export default compose(
  withStyles(styles, {name: 'DrawFeatures'}),
  connect(mapStateToProps, mapDispatchToProps),
)(DrawFeatures);

// export default connect(mapStateToProps, mapDispatchToProps)(DrawFeatures);

