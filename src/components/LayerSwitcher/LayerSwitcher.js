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
export default class LayerSwitcher extends React.Component {
  availableColorPalettes = [
    {
      url: `${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=seq-Blues&COLORBARONLY=true&WIDTH=200&HEIGHT=20&VERTICAL=false`,
      name: 'default-scalar/seq-Blues'
    },
    {
      url: `${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=div-BuRd&COLORBARONLY=true&WIDTH=200&HEIGHT=20&VERTICAL=false`,
      name: 'default-scalar/div-BuRd'
    }
  ];
  static propTypes = {
    onToggleMapPanel: React.PropTypes.func.isRequired,
    fetchShapefiles: React.PropTypes.func.isRequired,
    selectColorPalette: React.PropTypes.func.isRequired,
    selectDatasetLayer: React.PropTypes.func.isRequired,
    selectShapefile: React.PropTypes.func.isRequired,
    selectBasemap: React.PropTypes.func.isRequired,
    currentVisualizedDatasetLayers: React.PropTypes.array.isRequired,
    selectedColorPalette: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedBasemap: React.PropTypes.string.isRequired,
    publicShapeFiles: React.PropTypes.array.isRequired,
    baseMaps: React.PropTypes.array.isRequired
  };

  constructor (props) {
    super(props);
    this._onHideLayerSwitcherPanel = this._onHideLayerSwitcherPanel.bind(this);
    this.setSelectedShapefile = this.setSelectedShapefile.bind(this);
    this.setSelectedBaseMap = this.setSelectedBaseMap.bind(this);
    this.setSelectedDatasetLayer = this.setSelectedDatasetLayer.bind(this);
    this.setDatasetLayerOpacity = this.setDatasetLayerOpacity.bind(this);
    this.setSelectedColorPalette = this.setSelectedColorPalette.bind(this);
    this.resetDatasetLayer = this.resetDatasetLayer.bind(this);
    this.resetShapefile = this.resetShapefile.bind(this);
    this.props.selectColorPalette(this.availableColorPalettes[0]);
  }

  componentDidMount () {
    this.props.fetchShapefiles();
    this.setSelectedBaseMap(null, 'Aerial');
  }

  _onHideLayerSwitcherPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_LAYER_SWITCHER_PANEL);
  }

  setSelectedShapefile (event, value) {
    this.props.selectShapefile(value);
  }

  setSelectedBaseMap (event, value) {
    this.props.selectBasemap(value);
  }

  setSelectedDatasetLayer (event, value) {
    let selectedDataset = this.props.currentVisualizedDatasetLayers.find(dataset => dataset.dataset_id === value);
    this.props.selectDatasetLayer({
      ...selectedDataset,
      opacity: this.props.selectedDatasetLayer.opacity
    });
  }

  setDatasetLayerOpacity (event, value) {
    this.props.selectDatasetLayer({
      ...this.props.selectedDatasetLayer,
      opacity: value
    });
  }

  setSelectedColorPalette (event, index, value) {
    this.props.selectColorPalette(value);
  }

  resetShapefile () {
    this.props.selectShapefile({});
  }

  resetDatasetLayer () {
    this.props.selectDatasetLayer({});
  }

  makeShapefileList () {
    return (
      <List
        style={{height: '252px', overflowY: 'auto'}}
        className={classes['layers']}>
        <ListItem
          initiallyOpen
          primaryTogglesNestedList
          primaryText="Public"
          nestedItems={
            this.props.publicShapeFiles.map((shapeFile, i) => {
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
        <ListItem
          primaryTogglesNestedList
          primaryText="Private (TODO)" />
      </List>
    );
  }

  makeBaseMapsList () {
    return (
      <List
        style={{height: '300px', overflowY: 'auto'}}
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
        style={{height: '252px', overflowY: 'auto'}}
        className={classes['layers']}>
        {
          this.props.currentVisualizedDatasetLayers.map((dataset, i) => {
            return (
              <ListItem
                key={i}
                primaryText={dataset.dataset_id}
                leftCheckbox={
                  <RadioButtonGroup
                    name="selectedDatasetLayer"
                    valueSelected={this.props.selectedDatasetLayer.dataset_id}
                    onChange={this.setSelectedDatasetLayer}>
                    <RadioButton value={dataset.dataset_id} />
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
    if (isNaN(this.props.selectedDatasetLayer.opacity)) {
      this.setDatasetLayerOpacity(null, 0.8);
    }
    return (
      <div style={{padding: '0 15px'}}>
        <div style={{textAlign: 'center'}}>opacity: {Math.floor(this.props.selectedDatasetLayer.opacity * 100)}%
        </div>
        <Slider
          step={0.05}
          onChange={this.setDatasetLayerOpacity}
          value={this.props.selectedDatasetLayer.opacity} />
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
        this.availableColorPalettes.map((palette, i) => {
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
            iconElementRight={<IconButton><MinimizeIcon
              onTouchTap={(event) => this._onHideLayerSwitcherPanel()} /></IconButton>} />
          <Tabs>
            <Tab
              style={{height: '100%'}}
              icon={<FontIcon className="material-icons">satellite</FontIcon>}
              label="Datasets">
              <Paper zDepth={2}>
                <div style={{width: '75%', display: 'inline-block', padding: '0 15px'}}>
                  {this.makeColorPalettesSelect()}
                </div>
                <div style={{width: '25%', display: 'inline-block'}}>
                  <Subheader>
                    <RaisedButton
                      onClick={this.resetDatasetLayer}
                      label="Reset" />
                  </Subheader>
                </div>
                {this.props.selectedDatasetLayer.dataset_id ? this.makeSlider() : null}
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
