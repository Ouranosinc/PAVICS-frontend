import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/lab/Slider';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Satellite from '@material-ui/icons/Satellite';
import LocalLibrary from '@material-ui/icons/LocalLibrary';
import Map from '@material-ui/icons/Map';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Collapse from '@material-ui/core/Collapse';

const AVAILABLE_COLOR_PALETTES = [
  'seq-Blues',
  'div-BuRd',
  'default'
];
const styles = {
  list: {
    height: '260px',
    overflowY: 'auto'
  },
  subHeader: {
    backgroundColor: 'white'
  }
};

export default class LayerSwitcher extends React.Component {
  static propTypes = {
    visualize: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.props.visualizeActions.selectColorPalette(AVAILABLE_COLOR_PALETTES[0]);
    this.state = {
      tabValue: 0,
      open: {}
    };
  }

  setSelectedShapefile = (event, value) => {
    this.props.visualizeActions.resetSelectedRegions();
    this.props.visualizeActions.selectShapefile(this.props.visualize.publicShapeFiles.find(f => f.title === value));
  };

  setSelectedBaseMap = (event, value) => {
    this.props.visualizeActions.selectBasemap(value);
  };

  setCurrentDisplayedDataset = (event, value) => {
    let selectedDataset = this.props.visualize.currentVisualizedDatasets.find(dataset => dataset.uniqueLayerSwitcherId === value);
    this.props.visualizeActions.selectCurrentDisplayedDataset({
      ...selectedDataset,
      currentFileIndex: 0,
      opacity: this.props.visualize.currentDisplayedDataset.opacity
    });
  };

  setDatasetLayerOpacity = (event, value) => {
    this.props.visualizeActions.selectCurrentDisplayedDataset({
      ...this.props.visualize.currentDisplayedDataset,
      currentFileIndex: 0,
      opacity: value
    });
  };

  setSelectedColorPalette = (event) => {
    this.props.visualizeActions.selectColorPalette(event.target.value);
  };

  resetShapefile = () => {
    this.props.visualizeActions.selectShapefile({});
    this.props.visualizeActions.resetSelectedRegions();
  };

  resetDatasetLayer = () => {
    this.props.visualizeActions.selectCurrentDisplayedDataset({});
  };

  makeToggleWorkspaceCallback = workspaceName => {
    return () => {
      this.setState({
        open: {
          ...this.state.open,
          [workspaceName]: !this.state.open[workspaceName]
        }
      });
    };
  };

  makeShapefileList () {
    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          id="cy-reset-shapefile-btn"
          onClick={this.resetShapefile}>
          Reset
        </Button>
        <List style={styles.list}>
          {
            Object.keys(this.props.visualize.publicShapeFiles).map((workspaceName, j) => {
              const workspaceLayers = this.props.visualize.publicShapeFiles[workspaceName];
              return (
                <div style={styles.subHeader} key={j}>
                  <ListSubheader onClick={this.makeToggleWorkspaceCallback(workspaceName)}>{workspaceName}</ListSubheader>
                  <Collapse in={this.state.open[workspaceName]}>
                  {
                    workspaceLayers.map((shapeFile, i) =>
                      <ListItem
                        className="cy-layerswitcher-shapefile-item"
                        id={`cy-shapefile-name-${shapeFile.title}`}
                        key={i}>
                        <RadioGroup
                          name="selectedShapeFile"
                          value={this.props.visualize.selectedShapefile.title}
                          onChange={this.setSelectedShapefile}>
                          <FormControlLabel value={shapeFile.title} control={<Radio color="secondary" />} label={shapeFile.title} />
                        </RadioGroup>
                      </ListItem>
                    )
                  }
                  </Collapse>
                </div>
              );
            })
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
        {
          this.props.visualize.baseMaps.map((map, i) =>
            <ListItem
            className="cy-layerswitcher-basemap-item"
            key={i}>
              <RadioGroup
                name="selectedBaseMap"
                value={this.props.visualize.selectedBasemap}
                onChange={this.setSelectedBaseMap}>
                <FormControlLabel value={map} control={<Radio color="secondary" />} label={map} />
              </RadioGroup>
            </ListItem>
          )
        }
      </List>
    );
  }

  makeDatasetsList () {
    return (
      <React.Fragment>
        <ListSubheader disableSticky>
          <div style={{width: '25%', display: 'inline-block'}}>
            <Button variant="contained"
                    color="primary"
                    id="cy-reset-dataset-btn"
                    onClick={this.resetDatasetLayer}>
              Reset
            </Button>
          </div>
          <div style={{width: '75%', display: 'inline-block', padding: '0 15px'}}>
            {this.makeColorPalettesSelect()}
          </div>
          {this.makeSlider()}
        </ListSubheader>
        <List style={styles.list}>
          {
            this.props.visualize.currentVisualizedDatasets.map((dataset, i) => {
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
                  className="cy-layerswitcher-dataset-item">
                  <RadioGroup
                    name="currentDisplayedDataset"
                    value={this.props.visualize.currentDisplayedDataset.uniqueLayerSwitcherId}
                    onChange={this.setCurrentDisplayedDataset}>
                    <FormControlLabel
                      value={dataset.uniqueLayerSwitcherId}
                      label={<ListItemText inset
                                           primary={dataset['aggregate_title']}
                                           secondary={<span>{secondaryText}</span>} />}
                      control={
                        <Radio
                          color="secondary"
                          data-cy-selected={this.props.visualize.currentDisplayedDataset.uniqueLayerSwitcherId === dataset.uniqueLayerSwitcherId}/>} />
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
    if (isNaN(this.props.visualize.currentDisplayedDataset.opacity)) {
      this.setDatasetLayerOpacity(null, 0.8);
    }
    return (
      <Slider
         disabled={!this.props.visualize.currentDisplayedDataset.uniqueLayerSwitcherId}
         min={0}
         max={1}
         step={0.05}
         value={this.props.visualize.currentDisplayedDataset.opacity}
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
            background: `url(${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=${this.props.visualize.selectedColorPalette}&COLORBARONLY=true&WIDTH=200&HEIGHT=20&VERTICAL=false) center no-repeat`/*`*/,
            padding: '0 0 0 10px'
          }}
          value={this.props.visualize.selectedColorPalette}
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
