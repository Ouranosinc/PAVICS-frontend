import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tab from'@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Select from'@material-ui/core/Select';
import MenuItem from'@material-ui/core/MenuItem';
import Slider from '@material-ui/lab/Slider';
import Radio from'@material-ui/core/Radio';
import RadioGroup from'@material-ui/core/RadioGroup';
import Satellite from '@material-ui/icons/Satellite';
import LocalLibrary from '@material-ui/icons/LocalLibrary';
import Map from '@material-ui/icons/Map';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';

const AVAILABLE_COLOR_PALETTES = [
  'seq-Blues',
  'div-BuRd',
  'default'
];
const styles = {
  list: {
    height: '300px',
    overflowY: 'auto'
  }
};

export default class WidgetLayerSwitcher extends React.Component {
  static propTypes = {
    layerBasemap: PropTypes.object.isRequired,
    layerBasemapActions: PropTypes.object.isRequired,
    layerDataset: PropTypes.object.isRequired,
    layerDatasetActions: PropTypes.object.isRequired,
    layerRegion: PropTypes.object.isRequired,
    layerRegionActions: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.props.layerDatasetActions.selectColorPalette(AVAILABLE_COLOR_PALETTES[0]);
    this.state = {
      tabValue: 0
    }
  }

  componentDidMount () {
    this.props.layerRegionActions.fetchShapefiles();
  }

  setSelectedShapefile = (event, value) => {
    this.props.layerRegionActions.resetSelectedRegions();
    this.props.layerRegionActions.selectShapefile(this.props.layerRegion.publicShapeFiles.find(f => f.title === value));
  };

  setSelectedBaseMap = (event, value) => {
    this.props.layerBasemapActions.selectBasemap(value);
  };

  setCurrentDisplayedDataset = (event, value) => {
    let selectedDataset = this.props.layerDataset.currentVisualizedDatasets.find(dataset => dataset.uniqueLayerSwitcherId === value);
    this.props.layerDatasetActions.selectCurrentDisplayedDataset({
      ...selectedDataset,
      currentFileIndex: 0,
      opacity: this.props.layerDataset.currentDisplayedDataset.opacity
    });
  };

  setDatasetLayerOpacity = (event, value) => {
    this.props.layerDatasetActions.selectCurrentDisplayedDataset({
      ...this.props.layerDataset.currentDisplayedDataset,
      currentFileIndex: 0,
      opacity: value
    });
  };

  setSelectedColorPalette = (event) => {
    this.props.layerDatasetActions.selectColorPalette(event.target.value);
  };

  resetShapefile = () => {
    this.props.layerRegionActions.selectShapefile({});
    this.props.layerRegionActions.resetSelectedRegions();
  };

  resetDatasetLayer = () => {
    this.props.layerDatasetActions.selectCurrentDisplayedDataset({});
  };

  /*
  this routine should iterate through the different workspaces that are available to the user and show them separated by workspace name.
  Presently, they're all flat on a single level, but should eventually be grouped by the workspace name
   */
  makeShapefileList () {
    return (
      <React.Fragment>
        <ListSubheader>
          <Button variant="contained"
                  color="primary"
                  id="cy-reset-shapefile-btn"
                  onClick={this.resetShapefile}>
            Reset
          </Button>
        </ListSubheader>
        <List style={styles.list}>
          {
            this.props.layerRegion.publicShapeFiles.map( (shapeFile, i) =>
              <ListItem
                className="cy-WidgetLayerSwitcher-shapefile-item"
                id={`cy-shapefile-name-${shapeFile.title}`}// `
                key={i}>
                <RadioGroup
                  name="selectedShapeFile"
                  value={this.props.layerRegion.selectedShapefile.title}
                  onChange={this.setSelectedShapefile}>
                  <FormControlLabel value={shapeFile.title} control={<Radio color="secondary" />} label={shapeFile.title} />
                </RadioGroup>
              </ListItem>
            )
          }
        </List>
      </React.Fragment>
    );
  }

  makeBaseMapsList () {
    return (
      <List
        component="nav"
        style={styles.list}>
        <ListSubheader disableSticky>2D EPSG:4326</ListSubheader>
        {
          this.props.layerBasemap.baseMaps.map((map, i) =>
            <ListItem
            className="cy-WidgetLayerSwitcher-basemap-item"
            key={i}>
              <RadioGroup
                name="selectedBaseMap"
                value={this.props.layerBasemap.selectedBasemap}
                onChange={this.setSelectedBaseMap}>
                <FormControlLabel value={map} control={<Radio color="secondary" />} label={map} />
              </RadioGroup>
            </ListItem>
          )
        }
        <ListSubheader disableSticky>3D</ListSubheader>
        <ListItem className="cy-WidgetLayerSwitcher-basemap-item">
          <RadioGroup
            name="selectedBaseMap"
            value={this.props.layerBasemap.selectedBasemap}
            onChange={this.setSelectedBaseMap}>
            <FormControlLabel value="Cesium" control={<Radio color="secondary" />} label="Cesium (prototype)" />
          </RadioGroup>
        </ListItem>
      </List>
    );
  }

  makeDatasetsList () {
    return (
      <React.Fragment>
        <ListSubheader disableSticky>
          <Grid container>
            <Grid item sm={12} md={4}>
              <Button variant="contained"
                      color="primary"
                      id="cy-reset-dataset-btn"
                      onClick={this.resetDatasetLayer}>
                Reset
              </Button>
            </Grid>
            <Grid item sm={12} md={8}>
              {this.makeColorPalettesSelect()}
            </Grid>
          </Grid>
          {this.makeSlider()}
        </ListSubheader>
        <List style={styles.list}>
          {
            this.props.layerDataset.currentVisualizedDatasets.map((dataset, i) => {
              let secondaryText = '';
              if (dataset.wms_url.length === 1) {
                const SEARCH_VALUE = '/';
                let index = dataset.wms_url[0].lastIndexOf(SEARCH_VALUE);
                secondaryText = `${dataset.wms_url[0].substring(index + SEARCH_VALUE.length)}`;// `
              } else {
                secondaryText = `${dataset.wms_url.length} aggregated file${(dataset.wms_url.length > 1) ? 's' : ''}`;// `
              }
              return (
                <ListItem
                  key={i}
                  className="cy-WidgetLayerSwitcher-dataset-item">
                  <RadioGroup
                    name="currentDisplayedDataset"
                    value={this.props.layerDataset.currentDisplayedDataset.uniqueLayerSwitcherId}
                    onChange={this.setCurrentDisplayedDataset}>
                    <FormControlLabel
                      value={dataset.uniqueLayerSwitcherId}
                      label={<ListItemText inset
                                           primary={dataset['aggregate_title']}
                                           secondary={<span>{secondaryText}</span>} />}
                      control={
                        <Radio
                          color="secondary"
                          data-cy-selected={this.props.layerDataset.currentDisplayedDataset.uniqueLayerSwitcherId === dataset.uniqueLayerSwitcherId}/>} />
                  </RadioGroup>
                </ListItem>
              );
            })
          }
        </List>
      </React.Fragment>
    );
  }

  makeSlider () {
    // not so clever trick so that opacity is not undefined when resetting layer
    // should stay aligned with initialState's opacity
    if (isNaN(this.props.layerDataset.currentDisplayedDataset.opacity)) {
      this.setDatasetLayerOpacity(null, 0.8);
    }
    return (
      <Slider
         disabled={!this.props.layerDataset.currentDisplayedDataset.uniqueLayerSwitcherId}
         min={0}
         max={1}
         step={0.05}
         value={this.props.layerDataset.currentDisplayedDataset.opacity}
         onChange={this.setDatasetLayerOpacity}/>
    );
  }

  makeColorPalettesSelect () {
    return (
      <FormControl style={{width: '100%'}}>
        <InputLabel htmlFor="palette">Color Palette</InputLabel>
        <Select
          style={{
            width: '80%',
            textAlign: 'center',
            textShadow: '1px 1px 2px white, 0 0 25px white, 0 0 5px white',
            background: `url(${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=${this.props.layerDataset.selectedColorPalette}&COLORBARONLY=true&WIDTH=200&HEIGHT=20&VERTICAL=false) center no-repeat`/*`*/,
            padding: '0 0 0 10px'
          }}
          value={this.props.layerDataset.selectedColorPalette}
          onChange={this.setSelectedColorPalette}
          inputProps={{
            name: 'palette',
            id: 'palette',
          }}>
          {AVAILABLE_COLOR_PALETTES.map((palette, i) =>
            <MenuItem
              key={i}
              value={palette}
              style={{
                textShadow: '1px 1px 2px white, 0 0 25px white, 0 0 5px white',
                width: '100%',
                background: `url(${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=${palette}&COLORBARONLY=true&WIDTH=200&HEIGHT=20&VERTICAL=false) center no-repeat`, padding: '0 0 0 10px'}}/*`*/>
              {palette}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    );
  }

  render () {
    return (
      <React.Fragment>
        <AppBar position="static" color="default">
          <Tabs
            centered
            fullWidth
            value={this.state.tabValue}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, value) => this.setState({ tabValue: value })}>
            <Tab
              style={{minWidth: '130px'}}
              id="cy-layerswitcher-datasets-tab"
              icon={<Satellite />}
              label="Datasets">
            </Tab>
            <Tab
              style={{minWidth: '130px'}}
              id="cy-layerswitcher-regions-tab"
              icon={<LocalLibrary />}
              label="Regions">
            </Tab>
            <Tab
              style={{minWidth: '130px'}}
              id="cy-layerswitcher-basemaps-tab"
              icon={<Map />}
              label="Base Maps">
            </Tab>
          </Tabs>
        </AppBar>
        {this.state.tabValue === 0 &&
        <Paper elevation={2}>
          {this.makeDatasetsList()}
        </Paper>
        }
        {this.state.tabValue === 1 &&
        <Paper elevation={2}>
          {this.makeShapefileList()}
        </Paper>
        }
        {this.state.tabValue === 2 &&
        <Paper elevation={2}>
          {this.makeBaseMapsList()}
        </Paper>
        }
      </React.Fragment>
    );
  }
}