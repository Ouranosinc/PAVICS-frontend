import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import { NotificationManager } from 'react-notifications';
import geojson from 'shp-write/src/geojson';
import {VISUALIZE_DRAW_MODES} from './../../constants';
import Divider from'@material-ui/core/Divider';
import Button from'@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import DrawIcon from '@material-ui/icons/FormatShapes';
import FileUpload from '@material-ui/icons/FileUpload';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon  from '@material-ui/icons/Folder';

const styles = theme => ({
  form: {
    height: '100%',
    overflowY: 'auto'
  },
  container: {
    height: '350px',
  }
});

/*
  TODO: User could pick workspace and datastore
  TODO: User could chose to toggle a Multi-poly/line/point, such toggle would append information in the same geometry and shapefile client-side
  At the moment, shp-write library automatically creates one MULTIPOLYGON if many polygons, so we have to splits polygons into multiple shapefiles.
  Geoserver is in charge of appending such individual shapefiles into a single shapefile containing multiple polygons.
 */
class WidgetDrawFeatures extends React.Component {
  static propTypes = {
    layerCustomFeature: PropTypes.object.isRequired,
    layerCustomFeatureActions: PropTypes.object.isRequired
  };

  state = {
    tabValue: 0,
    name: '',
    description: '',
    regionIdentifier: '',
    featureIdentifier: '',
    fileName: '',
    fileType: '',
    fileSize: '',
    fileLastModified: 'N/A',
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    /*const {currentSelectedDrawnFeatureProperties} = nextProps.layerCustomFeature;
    if (currentSelectedDrawnFeatureProperties && currentSelectedDrawnFeatureProperties !== this.props.layerCustomFeature.currentSelectedDrawnFeatureProperties) {
      this.setState({
        name: currentSelectedDrawnFeatureProperties.name,
        description: currentSelectedDrawnFeatureProperties.description
      })
    }*/
  }

  onSelectedDrawingTool = (event) => {
    this.props.layerCustomFeatureActions.setCurrentDrawingTool(event.target.value);
  };

  onResetDrawingLayer = () => {
    this.props.layerCustomFeatureActions.resetGeoJSONDrawnFeatures();
  };

  onDownloadDrawnLayer = () => {
    this.props.layerCustomFeatureActions.createDownloadZipShapefile(this.state.regionIdentifier);
  };

  /*
    Currently used can:
    - UPLOAD-CREATE (if filename doesn't exists or has only one polygon)
    - UPLOAD-APPEND (if filename exists or user has currently drawn multiple polygons, next polygons will be appended)
    We should also make sure drawn polygons have the same type than the targeted filename is such file currently exists on geoserver
  */
  onUploadDrawnLayer = () => {
    const { layerCustomFeature, layerCustomFeatureActions } = this.props;
    if (this.state.regionIdentifier.length) {
      if (layerCustomFeature.geoJSONDrawnFeatures.features.length) {
        const type = layerCustomFeature.geoJSONDrawnFeatures.features[0].geometry.type;
        if (layerCustomFeature.geoJSONDrawnFeatures.features.every( f => f.geometry.type === type)) {
          layerCustomFeatureActions.createUploadZipShapefile(this.state.regionIdentifier);
        } else {
          NotificationManager.warning(`All drawn features should be of the same type (Polygon or LineString or Point) before trying to upload.`, 'Warning', 10000);
        }
      } else {
        NotificationManager.warning(`At least one new custom region must be drawn before trying to upload.`, 'Warning', 10000);
      }
    } else {
      NotificationManager.warning(`Region identifier is required before uploading drawn custom regions.`, 'Warning', 10000);
    }
  };

  /*
    Old method that used to store new information in redux, so it could be retrieved by OLDrawFeatures to be shown on the map inside the polygon itself
    Current component used to actually re-render() in componentWillReceiveProps -> setState()
  */
  onHandleTextChangedOld = field => event => {
    let cpy = Object.assign({}, this.props.layerCustomFeature.currentSelectedDrawnFeatureProperties);
    cpy[field] = event.target.value;
    this.props.layerCustomFeatureActions.setCurrentSelectedDrawnFeature(cpy);
  };

  onHandleTextChanged = field => event => {
    let newState = {};
    newState[field] = event.target.value;
    this.setState(newState);
  };

  onUploadFromDisk = event => {
    const workspace = __PAVICS_GEOSERVER_CUSTOM_WORKSPACE__;
    const datastore = __PAVICS_GEOSERVER_CUSTOM_DATASTORE__;
    var blobData = new Blob([this.state.file], {type: 'application/zip'});
    this.props.layerCustomFeatureActions.uploadZipShapefiles(workspace, datastore, this.state.fileName, [blobData]);
    this.setState({
      file: null,
      fileName: '',
      fileType: '',
      fileSize: 0,
      fileLastModified: 'n/a'
    });
  };

  handleFileSelect = (evt) => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
    var files = evt.target.files;
    // Only a single file actually allowed
    var file = files[0];
    this.setState({
      file: file,
      fileName: file.name.trim(),
      fileType: file.type,
      fileSize: file.size,
      fileLastModified: file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a'
    });
  };

  displayType() {
    const { geoJSONDrawnFeatures } = this.props.layerCustomFeature;
    const layers = [geojson.point(geoJSONDrawnFeatures), geojson.line(geoJSONDrawnFeatures), geojson.polygon(geoJSONDrawnFeatures)];
    let types = [];
    layers.forEach(layer => {
      if (layer.geometries.length && layer.geometries[0].length) {
        types.push(layer.type);
      }
    });
    if (types.length === 1) {
      return <Typography variant="subheading">Regions type: <strong>{types[0]}</strong></Typography>;
    } else if (types.length > 1) {
      return <Typography variant="subheading" color="error">Regions type: <strong>{types.join(', ')}</strong></Typography>;
    } else {
      return <Typography variant="subheading">Regions type: <strong>N/A</strong></Typography>;
    }
  }

  render() {
    const {currentDrawingTool, currentSelectedDrawnFeatureProperties, geoJSONDrawnFeatures} = this.props.layerCustomFeature;
    // const {name, description} = this.state;
    const {featureIdentifier, regionIdentifier} = this.state;
    return (
      <React.Fragment>
        <AppBar position="static" color="default">
          <Tabs
            centered
            fullWidth
            value={this.state.tabValue}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, value) => this.setState({tabValue: value})}>
            <Tab
              id="cy-customizeregions-draw-tab"
              icon={<DrawIcon />}
              label="Draw custom region"/>
            <Tab
              id="cy-customizeregions-upload-tab"
              icon={<FileUpload />}
              label="Upload Shapefile"/>
          </Tabs>
        </AppBar>
        <Paper>
          <div style={{height: '350px'}} className="container">
          {this.state.tabValue === 0 &&
          <div style={styles.form}>
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
            <TextField
              required
              fullWidth
              value={regionIdentifier}
              onChange={this.onHandleTextChanged('regionIdentifier')}
              label="Region's identifier"/>
            {/*<TextField
              fullWidth
              value={featureIdentifier}
              onChange={this.onHandleTextChanged('featureIdentifier')}
              label="Feature's identifier"/>*/}
            <Typography variant="subheading">Drawn regions total: <strong>{geoJSONDrawnFeatures.features.length}</strong></Typography>
            { this.displayType() }
            <Button variant="contained"
                    color="primary"
                    onClick={this.onResetDrawingLayer}>
              Reset
            </Button>
            <Button style={{marginLeft: '15px'}}
                    variant="contained"
                    color="secondary"
                    onClick={this.onUploadDrawnLayer}>
              Upload
            </Button>
            {/*
            Download button disabled for now, should be eventually positioned in the the layer-switcher for each geoserver's available layer
            <Button style={{marginLeft: '15px'}}
                    variant="contained"
                    color="secondary"
                    onClick={this.onDownloadDrawnLayer}>
              Download
            </Button>*/}
            {
              // Following code helps defining a name and a description to every drawn feature
              // It's deprecated since the library only insert a single MultiPolygon containing all polygons, so end-up with one feature only
              // Setting null afterward in the reducer somehow doesn't work
              /*(currentSelectedDrawnFeatureProperties && currentSelectedDrawnFeatureProperties.name) ?
                <React.Fragment>
                 <Divider style={{margin: '15px 0'}}/>
                 <Typography variant="subheading">
                   Selected custom region
                 </Typography>
                  <TextField
                    fullWidth
                    value={name}
                    onChange={this.onHandleTextChangedOld('name')}
                    label="Region's name"/><TextField
                  fullWidth
                  value={currentSelectedDrawnFeatureProperties.description}
                  onChange={this.onHandleTextChangedOld('description')}
                  label="Region's description"/>
                </React.Fragment> : null*/
            }
            <Typography variant="caption" style={{marginTop: '10px'}}>
              <strong>Tips:</strong>
              <div>Hold alt-shift keys to draw Bounding Box, Hexagon and Square</div>
              <div>Hold alt key to draw Polygon and Line</div>
              <div>Hold alt-shift keys to activate freehand drawing for Polygon and Line</div>
              <div>Select a region by a single click (one at a time)</div>
              <div>Drag region points extremities to edit a selected region</div>
              <div>Hold alt and click a point to delete it (when region is selected)</div>
            </Typography>
          </div>
          }
          {this.state.tabValue === 1 &&
          <div style={styles.form}>
            <Typography variant="subheading">
              This feature allow you to upload a shapefile from your local drive to the remote server. See ESRI Shapefile Technical Description for more details about Shapefile format.
            </Typography>
            <input
              accept="application/zip"
              style={{display: 'none'}}
              id="raised-button-file"
              type="file"
              onChange={this.handleFileSelect}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" color="secondary" component="span">
                Select ZIP from computer ...
              </Button>
            </label>
            {(this.state.fileName.length) ?
              <React.Fragment>
                <Card style={{marginTop: '10px'}}>
                  <CardHeader
                    avatar={
                      <Avatar aria-label="ZIP file">
                        <FolderIcon />
                      </Avatar>
                    }
                    title={this.state.fileName}
                    subheader={`Modified on: ${this.state.fileLastModified}, Size: ${this.state.fileSize}B`}/>
                </Card>
                {/*<FormControl fullWidth>
                 <InputLabel htmlFor="time">Workspace (TODO)</InputLabel>
                 <Select
                 disabled={true}
                 value={''}
                 inputProps={{
                 name: 'workspace',
                 id: 'workspace',
                 }}
                 onChange={(event) => {
                 }}>
                 <MenuItem value="">
                 TODO
                 </MenuItem>
                 </Select>
                 </FormControl>*/}
                <Divider />
                <Button variant="contained"
                        color="primary"
                        onClick={this.onUploadFromDisk}>
                  Upload
                </Button>
              </React.Fragment> : null
            }
          </div>
          }
          </div>
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(WidgetDrawFeatures);

