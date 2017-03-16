import React from 'react';
import * as classes from './LayerSwitcher.scss';
import * as constants from './../../constants';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
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
      url: `${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=seq-Blues&COLORBARONLY=true&WIDTH=264&HEIGHT=70&VERTICAL=false`,
      name: 'default-scalar/seq-Blues'
    },
    {
      url: `${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=div-BuRd&COLORBARONLY=true&WIDTH=264&HEIGHT=70&VERTICAL=false`,
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

  constructor () {
    super();
    this._onHideLayerSwitcherPanel = this._onHideLayerSwitcherPanel.bind(this);
    this.setSelectedShapefile = this.setSelectedShapefile.bind(this);
    this.setSelectedBaseMap = this.setSelectedBaseMap.bind(this);
    this.setSelectedDatasetLayer = this.setSelectedDatasetLayer.bind(this);
    this.setSelectedColorPalette = this.setSelectedColorPalette.bind(this);
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
    this.props.selectDatasetLayer(value);
  }

  setSelectedColorPalette (event, value) {
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
                      name="selectedBaseMap"f
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
                    valueSelected={this.props.selectedDatasetLayer}
                    onChange={this.setSelectedDatasetLayer}>
                    <RadioButton value={dataset} />
                  </RadioButtonGroup>
                } />
            );
          })
        }
      </List>
    );
  }

  makeColorPalettesList () {
    return (
      <List
        style={{height: '284px', overflowY: 'auto'}}>
        {
          this.availableColorPalettes.map(
            (palette, i) => {
              return (
                <ListItem
                  key={i}
                  primaryText={<img src={palette.url} />}
                  leftCheckbox={
                    <RadioButtonGroup
                      onChange={this.setSelectedColorPalette}
                      valueSelected={this.props.selectedColorPalette}
                      name="selectedColorPalette">
                      <RadioButton
                        value={palette}
                        label={palette.name}
                      />
                    </RadioButtonGroup>
                  } />
              );
            }
          )
        }
      </List>
    );
  }

  render () {
    return (
      <div className={classes['LayerSwitcher']}>
        <div className={classes['Tabs']}>
          <AppBar
            title="Layer Switcher"
            iconElementLeft={<IconButton><LayersIcon /></IconButton>}
            iconElementRight={<IconButton><MinimizeIcon onTouchTap={(event) => this._onHideLayerSwitcherPanel()} /></IconButton>} />
          <Tabs>
            <Tab
              style={{height: '100%'}}
              icon={<FontIcon className="material-icons">satellite</FontIcon>}
              label="Datasets">
              <Paper zDepth={2}>
                <Subheader>
                  <RaisedButton
                    onClick={this.resetDatasetLayer.bind(this)}
                    label="Reset" />
                </Subheader>
                {this.makeDatasetsList()}
              </Paper>
            </Tab>
            <Tab
              style={{height: '100%'}}
              icon={<FontIcon className="material-icons">invert_colors</FontIcon>}
              label="Color Palettes">
              <Paper zDepth={2}>
                <List>
                  {this.makeColorPalettesList()}
                </List>
              </Paper>
            </Tab>
            <Tab
              style={{height: '100%'}}
              icon={<FontIcon className="material-icons">local_library</FontIcon>}
              label="Shape Files">
              <Paper zDepth={2}>
                <Subheader>
                  <RaisedButton
                    onClick={this.resetShapefile.bind(this)}
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
