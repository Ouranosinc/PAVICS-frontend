import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
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
import {GeoJSON} from 'ol/format';
import shpwrite from 'shp-write';
import geojson from 'shp-write/src/geojson';
import JSZip from 'jszip';

// http://epsg.io/3857.geoserver
const PROJ_3857 = '3857=PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],AUTHORITY["EPSG","3857"]'

const styles = theme => ({
  form: {
    height: '100%',
    overflowY: 'auto'
  },
  container: {
    height: '350px',
  }
});

class WidgetDrawFeatures extends React.Component {
  static propTypes = {
    layerCustomFeature: PropTypes.object.isRequired,
    layerCustomFeatureActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
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

  createZipFileFromCustomDrawnFeature() {
    const geoJSONWriter = new GeoJSON();
    // FIXME: drawnCustomFeatures is way too large to be in redux
    console.log(this.props.layerCustomFeature.drawnCustomFeatures);
    const geoJSONString = geoJSONWriter.writeFeatures(this.props.layerCustomFeature.drawnCustomFeatures);
    let geoJSON = JSON.parse(geoJSONString);
    // Clear features or get a corrupted file and upload won't actually work for now
    geoJSON.features.map(feature => feature.properties = {});
    this.props.layerCustomFeatureActions.setGeoJSONDrawnFeatures(geoJSONString);

    // DEPRECATED, zip contains a folder at root
    /*var options = {
     folder: 'USER_SHAPEFILES',
     types: {
     polygon: 'CUSTOM_' + new Date().getTime(),
     }
     };
     const buffer = shpwrite.zip(geoJSON, options);
     shpwrite.download(geoJSON, options);*/

    // FIXME: FOLLOWING PROCEDURE CREATES ONE MULTIPOLYGON INSTEAD OF MANY POLYGONS
    let zip = new JSZip();
    const points = geojson.point(geoJSON);
    const lines = geojson.line(geoJSON);
    const polygons = geojson.polygon(geoJSON);
    const types = [points, lines, polygons];
    console.log(types.length);
    // TODO: MultiPolygon checkbox, when unchecked push one shapefile for each feature
    // EXPLORE: POLYGON + LINE => Valid Multipolygon ?
    types.forEach((layer) => {
      if (layer.geometries.length && layer.geometries[0].length) {
        shpwrite.write(
          // field definitions
          layer.properties,
          // geometry type
          layer.type,
          // geometries
          layer.geometries,
          (err, files) => {
            const fileName = (this.state.regionIdentifier)? this.state.regionIdentifier: 'CUSTOM_' + new Date().getTime();
            zip.file(fileName + '.shp', files.shp.buffer, {binary: true});
            zip.file(fileName + '.shx', files.shx.buffer, {binary: true});
            zip.file(fileName + '.dbf', files.dbf.buffer, {binary: true});
            zip.file(fileName + '.prj', PROJ_3857);
          });
      }
    });
    return zip;
  }

  onSelectedDrawingTool = (event) => {
    this.props.layerCustomFeatureActions.setCurrentDrawingTool(event.target.value);
  };

  onResetDrawingLayer = () => {
    this.props.layerCustomFeatureActions.setDrawnCustomFeatures([]);
  };

  onDownloadDrawnLayer = () => {
    let zip = this.createZipFileFromCustomDrawnFeature();
    const content = zip.generate({compression: 'STORE'});
    location.href = 'data:application/zip;base64,' + content;
  };

  onUploadDrawnLayer = () => {
    // Push to geoserver (Working)
    let zip = this.createZipFileFromCustomDrawnFeature();
    const content = zip.generate({type:"blob"});
    this.props.layerCustomFeatureActions.uploadZipShapefile(
     'CUSTOM_SHAPEFILES',
     'CUSTOM_SHAPEFILES_DS',
     content
     );
  };

  onHandleTextChangedOld = field => event => {
    let cpy = Object.assign({}, this.props.layerCustomFeature.currentSelectedDrawnFeatureProperties);
    cpy[field] = event.target.value;
    this.props.layerCustomFeatureActions.setCurrentSelectedDrawnFeature(cpy);
    // Then retrieve values for re-rendering in componentWillReceiveProps -> setState()
  };

  onHandleTextChanged = field => event => {
    let newState = {};
    newState[field] = event.target.value;
    this.setState(newState);
  };

  onUploadFromDisk = event => {
    const workspace = "CUSTOM_SHAPEFILES";
    const datastore = 'CUSTOM_SHAPEFILES_DS'; // '	USER_SHAPEFILES';
    var blobData = new Blob([this.state.file], {type: 'application/zip'});
    this.props.layerCustomFeatureActions.uploadZipShapefile(workspace, datastore, blobData);
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

  render() {
    const {currentDrawingTool, currentSelectedDrawnFeatureProperties, drawnCustomFeatures} = this.props.layerCustomFeature;
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
              fullWidth
              value={regionIdentifier}
              onChange={this.onHandleTextChanged('regionIdentifier')}
              label="Region's identifier"/>
            <TextField
              fullWidth
              value={featureIdentifier}
              onChange={this.onHandleTextChanged('featureIdentifier')}
              label="Feature's identifier"/>
            <Typography variant="subheading">Drawn regions total: {drawnCustomFeatures.length}</Typography>
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
            <Button style={{marginLeft: '15px'}}
                    variant="contained"
                    color="secondary"
                    onClick={this.onDownloadDrawnLayer}>
              Download
            </Button>
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

