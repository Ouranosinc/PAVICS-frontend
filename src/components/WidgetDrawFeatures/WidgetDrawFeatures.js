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

  onUploadDrawnLayer = () => {
    this.props.layerCustomFeatureActions.createUploadZipShapefile(this.state.regionIdentifier);
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

