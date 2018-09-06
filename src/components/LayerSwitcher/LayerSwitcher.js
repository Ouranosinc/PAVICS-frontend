import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
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
import ExpendMore from '@material-ui/icons/ExpandMore';
import ExpendLess from '@material-ui/icons/ExpandLess';

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
  topBar: {
    padding: '0 24px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between'
  },
  subHeader: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
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
      open: {},
      textFilter: '',
      filteredLayers: {}
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.visualize.featureLayers !== prevProps.visualize.featureLayers) {
      this.filterFeatureLayers();
    }
  }

  setTextFilter = event => {
    this.setState({
      textFilter: event.target.value
    }, this.filterFeatureLayers);
  };

  filterFeatureLayers = () => {
    let layers = {};
    Object.keys(this.props.visualize.featureLayers).map(workspaceName => {
      const theseLayers = this.props.visualize.featureLayers[workspaceName].filter(layer => {
        return layer.title.indexOf(this.state.textFilter) !== -1;
      });
      if (theseLayers.length > 0) {
        layers[workspaceName] = theseLayers;
      }
    });
    this.setState({
      filteredLayers: layers
    });
  };

  setSelectedFeatureLayer = (event, value) => {
    this.props.visualizeActions.resetSelectedRegions();
    Object.keys(this.props.visualize.featureLayers).map(workspaceName => {
      this.props.visualize.featureLayers[workspaceName].map(layer => {
        if (layer.title === value) {
          this.props.visualizeActions.selectFeatureLayer(layer);
        }
      });
    });
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

  resetFeatureLayer = () => {
    this.props.visualizeActions.selectFeatureLayer({});
    this.props.visualizeActions.resetSelectedRegions();
  };

  resetDatasetLayer = () => {
    this.props.visualizeActions.selectCurrentDisplayedDataset({});
  };

  toggleWorkspace = workspaceName => () => {
    this.setState({
      open: {
        ...this.state.open,
        [workspaceName]: !this.state.open[workspaceName]
      }
    });
  };

  makeFeatureLayersList () {
    return (
      <React.Fragment>
        <div style={styles.topBar}>
          <Button
            variant="contained"
            color="primary"
            id="cy-reset-shapefile-btn"
            onClick={this.resetFeatureLayer}>
            Reset
          </Button>
          <TextField
            label="Text filter."
            onChange={this.setTextFilter}
            value={this.state.textFilter} />
        </div>
        <List style={styles.list}>
          {
            Object.keys(this.state.filteredLayers).map((workspaceName, j) => {
              const workspaceLayers = this.state.filteredLayers[workspaceName];
              return (
                <React.Fragment key={j}>
                  <ListSubheader
                    style={styles.subHeader}
                    onClick={this.toggleWorkspace(workspaceName)}>
                    {workspaceName}
                    {this.state.open[workspaceName] ? <ExpendLess /> : <ExpendMore />}
                  </ListSubheader>
                  <Collapse in={this.state.open[workspaceName]}>
                  {
                    workspaceLayers.map((layer, i) =>
                      <ListItem
                        className="cy-layerswitcher-shapefile-item"
                        id={`cy-shapefile-name-${layer.title}`}
                        key={i}>
                        <RadioGroup
                          name="selectedFeatureLayer"
                          value={this.props.visualize.selectedFeatureLayer.title}
                          onChange={this.setSelectedFeatureLayer}>
                          <FormControlLabel value={layer.title} control={<Radio color="secondary" />} label={layer.title} />
                        </RadioGroup>
                      </ListItem>
                    )
                  }
                  </Collapse>
                </React.Fragment>
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
          {this.makeFeatureLayersList()}
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
