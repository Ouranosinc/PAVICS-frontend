import React from 'react';
import * as classes from './LayerSwitcher.scss';
import * as constants from './../../constants';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Slider from 'material-ui/Slider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import LayersIcon from 'material-ui/svg-icons/maps/layers';
import MinimizeIcon from 'material-ui/svg-icons/content/remove';

const AVAILABLE_COLOR_PALETTES = [
  {
    url: `${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=seq-Blues&COLORBARONLY=true&WIDTH=200&HEIGHT=20&VERTICAL=false`,
    bigUrl: `${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=seq-Blues&COLORBARONLY=true&WIDTH=600&HEIGHT=60&VERTICAL=false`,
    name: 'default-scalar/seq-Blues'
  },
  {
    url: `${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=div-BuRd&COLORBARONLY=true&WIDTH=200&HEIGHT=20&VERTICAL=false`,
    bigUrl: `${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=div-BuRd&COLORBARONLY=true&WIDTH=600&HEIGHT=60&VERTICAL=false`,
    name: 'default-scalar/div-BuRd'
  }
];

export default class LayerSwitcher extends React.Component {
  static propTypes = {
    onToggleMapPanel: React.PropTypes.func.isRequired,
    fetchShapefiles: React.PropTypes.func.isRequired,
    selectColorPalette: React.PropTypes.func.isRequired,
    selectCurrentDisplayedDataset: React.PropTypes.func.isRequired,
    selectShapefile: React.PropTypes.func.isRequired,
    selectBasemap: React.PropTypes.func.isRequired,
    currentVisualizedDatasets: React.PropTypes.array.isRequired,
    selectedColorPalette: React.PropTypes.object.isRequired,
    currentDisplayedDataset: React.PropTypes.object.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    resetSelectedRegions: React.PropTypes.func.isRequired,
    selectedBasemap: React.PropTypes.string.isRequired,
    publicShapeFiles: React.PropTypes.array.isRequired,
    baseMaps: React.PropTypes.array.isRequired
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
    this.setSelectedBaseMap(null, 'Aerial');
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
                  primaryText={shapeFile.title}
                  key={i}
                  leftCheckbox={
                    <RadioButtonGroup
                      name="selectedShapeFile"
                      valueSelected={this.props.selectedShapefile}
                      onChange={this.setSelectedShapefile}>
                      <RadioButton value={shapeFile} />
                    </RadioButtonGroup>
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
                  primaryText={map}
                  key={i}
                  leftCheckbox={
                    <RadioButtonGroup
                      name="selectedBaseMap" f
                      valueSelected={this.props.selectedBasemap}
                      onChange={this.setSelectedBaseMap}>
                      <RadioButton value={map} />
                    </RadioButtonGroup>
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
        style={{height: '225px', overflowY: 'auto'}}
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
                primaryText={dataset['aggregate_title']}
                secondaryText={<span>{secondaryText}</span>}
                secondaryTextLines={1}
                leftCheckbox={
                  <RadioButtonGroup
                    name="currentDisplayedDataset"
                    valueSelected={this.props.currentDisplayedDataset.uniqueLayerSwitcherId}
                    onChange={this.setCurrentDisplayedDataset}>
                    <RadioButton value={dataset.uniqueLayerSwitcherId} />
                  </RadioButtonGroup>
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
          sliderStyle={{margin: '0'}}
          step={0.05}
          onChange={this.setDatasetLayerOpacity}
          value={this.props.currentDisplayedDataset.opacity} />
      </div>
    );
  }

  makeColorPalettesSelect () {
    return (
      <SelectField
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
                <div style={{background: `url(${palette.url}) center no-repeat`, padding: '0 0 0 10px'}}>
                  {palette.name}
                </div>
              } />
          );
        })
      }</SelectField>
    );
  }

  render () {
    return (
      <div className={classes['LayerSwitcher']}>
        <div className={classes['Tabs']}>
          <AppBar
            title="Layer Switcher"
            iconElementLeft={<IconButton><LayersIcon /></IconButton>}
            iconElementRight={<IconButton><MinimizeIcon onTouchTap={this._onHideLayerSwitcherPanel} /></IconButton>} />
          <Tabs>
            <Tab
              style={{height: '100%'}}
              icon={<FontIcon className="material-icons">satellite</FontIcon>}
              label="Datasets">
              <Paper zDepth={2}>
                <div style={{width: '65%', display: 'inline-block', padding: '0 15px'}}>
                  {this.makeColorPalettesSelect()}
                </div>
                <div style={{width: '35%', display: 'inline-block'}}>
                  <Subheader>
                    <RaisedButton
                      style={{marginLeft: '10px'}}
                      onClick={this.resetDatasetLayer}
                      label="Reset" />
                  </Subheader>
                </div>
                {this.makeSlider()}
                {this.makeDatasetsList()}
              </Paper>
            </Tab>
            <Tab
              icon={<FontIcon className="material-icons">local_library</FontIcon>}
              label="Shape Files">
              <Paper zDepth={2}>
                <Subheader>
                  <RaisedButton
                    onClick={this.resetShapefile}
                    label="Reset" />
                </Subheader>
                {this.makeShapefileList()}
              </Paper>
            </Tab>
            <Tab
              style={{height: '100%'}}
              icon={<FontIcon className="material-icons">map</FontIcon>}
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
