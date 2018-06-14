import React from 'react';
import PropTypes from 'prop-types';
import * as classes from './LayerSwitcher.scss';
import * as constants from './../../constants';
import {List, ListItem} from'@material-ui/core/List';
import {Tabs, Tab} from'@material-ui/core/Tabs';
import Select from'@material-ui/core/Select';
import MenuItem from'@material-ui/core/MenuItem';
// import Slider from'@material-ui/core/Slider';
import Slider  from 'rc-slider';
import {Radio, RadioGroup} from'@material-ui/core/Radio';
import Satellite from '@material-ui/icons/Satellite';
import LocalLibrary from '@material-ui/icons/LocalLibrary';
import Map from '@material-ui/icons/Map';
import Paper from'@material-ui/core/Paper';
import ListSubheader from'@material-ui/core/ListSubheader';
import Button from'@material-ui/core/Button';
import AppBar from'@material-ui/core/AppBar';
import IconButton from'@material-ui/core/IconButton';
import LayersIcon from '@material-ui/icons/Layers';
import MinimizeIcon from '@material-ui/icons/Remove';

const AVAILABLE_COLOR_PALETTES = [
  'seq-Blues',
  'div-BuRd',
  'default'
];

export default class LayerSwitcher extends React.Component {
  static propTypes = {
    onToggleMapPanel: PropTypes.func.isRequired,
    fetchShapefiles: PropTypes.func.isRequired,
    selectColorPalette: PropTypes.func.isRequired,
    selectCurrentDisplayedDataset: PropTypes.func.isRequired,
    selectShapefile: PropTypes.func.isRequired,
    selectBasemap: PropTypes.func.isRequired,
    currentVisualizedDatasets: PropTypes.array.isRequired,
    selectedColorPalette: PropTypes.string.isRequired,
    currentDisplayedDataset: PropTypes.object.isRequired,
    selectedShapefile: PropTypes.object.isRequired,
    resetSelectedRegions: PropTypes.func.isRequired,
    selectedBasemap: PropTypes.string.isRequired,
    publicShapeFiles: PropTypes.array.isRequired,
    baseMaps: PropTypes.array.isRequired
  };

  constructor (props) {
    super(props);
    this._onHideLayerSwitcherPanel = this._onHideLayerSwitcherPanel.bind(this);
    this.setSelectedShapefile = this.setSelectedShapefile.bind(this);
    this.setSelectedBaseMap = this.setSelectedBaseMap.bind(this);
    this.setCurrentDisplayedDataset = this.setCurrentDisplayedDataset.bind(this);
    this.setDatasetLayerOpacity = this.setDatasetLayerOpacity.bind(this);
    this.setSelectedColorPalette = this.setSelectedColorPalette.bind(this);
    this.resetDatasetLayer = this.resetDatasetLayer.bind(this);
    this.resetShapefile = this.resetShapefile.bind(this);
    this.props.selectColorPalette(AVAILABLE_COLOR_PALETTES[0]);
  }

  componentDidMount () {
    this.props.fetchShapefiles();
  }

  _onHideLayerSwitcherPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_LAYER_SWITCHER_PANEL);
  }

  setSelectedShapefile (event, value) {
    this.props.resetSelectedRegions();
    this.props.selectShapefile(value);
  }

  setSelectedBaseMap (event, value) {
    this.props.selectBasemap(value);
  }

  setCurrentDisplayedDataset (event, value) {
    let selectedDataset = this.props.currentVisualizedDatasets.find(dataset => dataset.uniqueLayerSwitcherId === value);
    this.props.selectCurrentDisplayedDataset({
      ...selectedDataset,
      currentFileIndex: 0,
      opacity: this.props.currentDisplayedDataset.opacity
    });
  }

  setDatasetLayerOpacity (event, value) {
    this.props.selectCurrentDisplayedDataset({
      ...this.props.currentDisplayedDataset,
      currentFileIndex: 0,
      opacity: value
    });
  }

  setSelectedColorPalette (event, index, value) {
    this.props.selectColorPalette(value);
  }

  resetShapefile () {
    this.props.selectShapefile({});
    this.props.resetSelectedRegions();
  }

  resetDatasetLayer () {
    this.props.selectCurrentDisplayedDataset({});
  }

  /*
  this routine should iterate through the different workspaces that are available to the user and show them separated by workspace name
  presently, they're all grouped under "public", which would be replaced by the workspace name
   */
  makeShapefileList () {
    // lol 302 px. such precision. very design.
    return (
      <List
        style={{height: '302px', overflowY: 'auto'}}
        className={classes['layers']}>
        <ListItem
          initiallyOpen
          primaryTogglesNestedList
          primaryText="Public"
          nestedItems={
            this.props.publicShapeFiles.map( (shapeFile, i) => {
              return (
                <ListItem
                  className="cy-layerswitcher-shapefile-item"
                  id={`cy-shapefile-name-${shapeFile.title}`}
                  primaryText={shapeFile.title}
                  key={i}
                  leftCheckbox={
                    <RadioGroup
                      name="selectedShapeFile"
                      valueSelected={this.props.selectedShapefile}
                      onChange={this.setSelectedShapefile}>
                      <Radio value={shapeFile} />
                    </RadioGroup>
                  }
                />
              );
            })
          } />
      </List>
    );
  }

  makeBaseMapsList () {
    return (
      <List
        style={{height: '350px', overflowY: 'auto'}}
        className={classes['layers']}>
        <ListItem
          initiallyOpen
          primaryTogglesNestedList
          primaryText="Bing"
          nestedItems={
            this.props.baseMaps.map((map, i) => {
              return (
                <ListItem
                  className="cy-layerswitcher-basemap-item"
                  primaryText={map}
                  key={i}
                  leftCheckbox={
                    <RadioGroup
                      name="selectedBaseMap" f
                      valueSelected={this.props.selectedBasemap}
                      onChange={this.setSelectedBaseMap}>
                      <Radio value={map} />
                    </RadioGroup>
                  }
                />
              );
            })
          } />
      </List>
    );
  }

  makeDatasetsList () {
    return (
      <List
        style={{height: '221px', overflowY: 'auto'}}
        className={classes['layers']}>
        {
          this.props.currentVisualizedDatasets.map((dataset, i) => {
            let secondaryText = '';
            if (dataset.wms_url.length === 1) {
              const SEARCH_VALUE = '/';
              let index = dataset.wms_url[0].lastIndexOf(SEARCH_VALUE);
              secondaryText = `${dataset.wms_url[0].substring(index + SEARCH_VALUE.length)}`;
            } else {
              secondaryText = `${dataset.wms_url.length} aggregated file${(dataset.wms_url.length > 1) ? 's' : ''}`;
            }
            return (
              <ListItem
                key={i}
                className="cy-layerswitcher-dataset-item"
                primaryText={dataset['aggregate_title']}
                secondaryText={<span>{secondaryText}</span>}
                secondaryTextLines={1}
                leftCheckbox={
                  <RadioGroup
                    name="currentDisplayedDataset"
                    valueSelected={this.props.currentDisplayedDataset.uniqueLayerSwitcherId}
                    onChange={this.setCurrentDisplayedDataset}>
                    <Radio
                      data-cy-selected={this.props.currentDisplayedDataset.uniqueLayerSwitcherId === dataset.uniqueLayerSwitcherId}
                      value={dataset.uniqueLayerSwitcherId} />
                  </RadioGroup>
                } />
            );
          })
        }
      </List>
    );
  }

  makeSlider () {
    // not so clever trick so that opacity is not undefined when resetting layer
    // should stay aligned with initialState's opacity
    if (isNaN(this.props.currentDisplayedDataset.opacity)) {
      this.setDatasetLayerOpacity(null, 0.8);
    }
    return (
      <div style={{padding: '0 15px'}}>
        <div style={{textAlign: 'center'}}>opacity: {Math.floor(this.props.currentDisplayedDataset.opacity * 100)}%
        </div>
        <Slider
          disabled={!this.props.currentDisplayedDataset.uniqueLayerSwitcherId}
          min={0}
          max={100}
          step={0.05}
          included={false}
          range={false}
          value={this.props.currentDisplayedDataset.opacity}
          onChange={this.setDatasetLayerOpacity}
        />

        {/*<Slider
          disabled={!this.props.currentDisplayedDataset.uniqueLayerSwitcherId}
          sliderStyle={{margin: '0'}}
          step={0.05}
          onChange={this.setDatasetLayerOpacity}
          value={this.props.currentDisplayedDataset.opacity} />*/}
      </div>
    );
  }

  makeColorPalettesSelect () {
    return (
      <Select
        selectedMenuItemStyle={{color: 'inherit'}}
        floatingLabelText="Color Palette"
        value={this.props.selectedColorPalette}
        onChange={this.setSelectedColorPalette}>{
        AVAILABLE_COLOR_PALETTES.map((palette, i) => {
          return (
            <MenuItem
              key={i}
              value={palette}
              primaryText={
                <div style={{background: `url(${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=${palette}&COLORBARONLY=true&WIDTH=200&HEIGHT=20&VERTICAL=false) center no-repeat`, padding: '0 0 0 10px'}}>
                  {palette}
                </div>
              } />
          );
        })
      }</Select>
    );
  }

  render () {
    return (
      <div className={classes['LayerSwitcher']}>
        <div className={classes['Tabs']}>
          <AppBar
            title="Layer Switcher"
            iconElementLeft={<IconButton><LayersIcon /></IconButton>}
            iconElementRight={<IconButton className="cy-minimize-btn" onTouchTap={this._onHideLayerSwitcherPanel}><MinimizeIcon /></IconButton>} />
          <Tabs>
            <Tab
              id="cy-layerswitcher-datasets-tab"
              style={{height: '100%'}}
              icon={<Satellite />}
              label="Datasets">
              <Paper zDepth={2}>
                <div style={{width: '65%', display: 'inline-block', padding: '0 15px'}}>
                  {this.makeColorPalettesSelect()}
                </div>
                <div style={{width: '35%', display: 'inline-block'}}>
                  <ListSubheader>
                    <Button variant="contained"
                      id="cy-reset-dataset-btn"
                      style={{marginLeft: '10px'}}
                      onClick={this.resetDatasetLayer}
                      label="Reset" />
                  </ListSubheader>
                </div>
                {this.makeSlider()}
                {this.makeDatasetsList()}
              </Paper>
            </Tab>
            <Tab
              id="cy-layerswitcher-regions-tab"
              icon={<LocalLibrary />}
              label="Regions">
              <Paper zDepth={2}>
                <ListSubheader>
                  <Button variant="contained"
                    id="cy-reset-shapefile-btn"
                    onClick={this.resetShapefile}
                    label="Reset" />
                </ListSubheader>
                {this.makeShapefileList()}
              </Paper>
            </Tab>
            <Tab
              id="cy-layerswitcher-basemaps-tab"
              style={{height: '100%'}}
              icon={<Map />}
              label="Base Maps">
              <Paper zDepth={2}>
                {this.makeBaseMapsList()}
              </Paper>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}
