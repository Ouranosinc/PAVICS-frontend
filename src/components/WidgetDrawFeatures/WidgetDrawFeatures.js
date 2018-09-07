import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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

const styles = theme => ({
  root: {

  }
});

class WidgetDrawFeatures extends React.Component {
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

  componentWillReceiveProps (nextProps) {
    const { currentSelectedDrawnFeatureProperties } = nextProps.customFeature;
    if(currentSelectedDrawnFeatureProperties && currentSelectedDrawnFeatureProperties !== this.props.customFeature.currentSelectedDrawnFeatureProperties) {
      this.setState({
        name: currentSelectedDrawnFeatureProperties.name,
        description: currentSelectedDrawnFeatureProperties.description
      })
    }
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

  onHandleTextChanged = field => event => {
    let cpy = Object.assign({}, this.props.customFeature.currentSelectedDrawnFeatureProperties);
    cpy[field] = event.target.value;
    this.props.customFeatureActions.setCurrentSelectedDrawnFeature(cpy);
  };

  onUploadFromDisk = event => {

  };

  render () {
    const { currentDrawingTool, currentSelectedDrawnFeatureProperties, drawnCustomFeatures } = this.props.customFeature;
    const { name, description } = this.state;
    return (
      <div className="container">
        <Typography variant="subheading">
          Draw custom regions
        </Typography>
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
        {/*<Typography variant="subheading">TODO: Add layer metadata fields</Typography>*/}
        <Typography variant="subheading">Drawn regions total: {drawnCustomFeatures.length}</Typography>
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
        {
          // Setting null afterward in the reducer somehow doesn't work
          (currentSelectedDrawnFeatureProperties && currentSelectedDrawnFeatureProperties.name) ?
            <React.Fragment>
              <Divider style={{margin: '15px 0'}}/>
              <Typography variant="subheading">
                Selected custom region
              </Typography>
              <TextField
                fullWidth
                value={name}
                onChange={this.onHandleTextChanged('name')}
                label="Region's name"/>
              <TextField
                fullWidth
                value={currentSelectedDrawnFeatureProperties.description}
                onChange={this.onHandleTextChanged('description')}
                label="Region's description"/>
            </React.Fragment> :
            <React.Fragment>
              <Divider style={{margin: '15px 0'}}/>
              <Typography variant="subheading">
                Upload a geopackage
              </Typography>
              <Button variant="contained"
                      color="secondary"
                      onClick={this.onUploadFromDisk}>
                Upload from disk
              </Button>
            </React.Fragment>
        }
      </div>
    );
  }
}

export default withStyles(styles)(WidgetDrawFeatures);

