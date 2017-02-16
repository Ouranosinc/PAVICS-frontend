import React from 'react';
import * as classes from './LayerSwitcher.scss';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
export default class LayerSwitcher extends React.Component {
  static propTypes = {
    fetchShapefiles: React.PropTypes.func.isRequired,
    openWmsLayer: React.PropTypes.func.isRequired,
    fetchWMSLayerDetails: React.PropTypes.func.isRequired,
    selectLoadWms: React.PropTypes.func.isRequired,
    selectShapefile: React.PropTypes.func.isRequired,
    selectBasemap: React.PropTypes.func.isRequired,
    currentVisualizedDatasetLayers: React.PropTypes.array.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedBasemap: React.PropTypes.string.isRequired,
    publicShapeFiles: React.PropTypes.array.isRequired,
    baseMaps: React.PropTypes.array.isRequired
  };

  constructor () {
    super();
    this.setSelectedShapefile = this.setSelectedShapefile.bind(this);
    this.setSelectedBaseMap = this.setSelectedBaseMap.bind(this);
    this.setSelectedDatasetLayer = this.setSelectedDatasetLayer.bind(this);
  }

  componentDidMount() {
    this.props.fetchShapefiles();
    this.setSelectedBaseMap(null, 'Aerial');
  }

  setSelectedShapefile (event, value) {
    this.props.selectShapefile(value);
  }

  setSelectedBaseMap (event, value) {
    this.props.selectBasemap(value);
  }

  setSelectedDatasetLayer (event, value) {
    let url = value.wms_url;
    let index = url.indexOf('DATASET=');
    let dataset = url.substr(index + 8);
    let layer = `${dataset}/${value.variable[0]}`;
    let date = '2006-01-01T00:00:00.000Z';
    let wmsURL = 'http://outarde.crim.ca:8080/ncWMS2/';
    this.props.openWmsLayer(layer);
    this.props.fetchWMSLayerDetails(wmsURL, layer);
    this.props.selectLoadWms(wmsURL, layer, date, '', 'default-scalar/div-RdYlBu', 0.4);
  }

  makeShapefileList () {
    return (
      <List className={classes['layers']}>
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
      </List>
    );
  }

  makeBaseMapsList () {
    return (
      <List className={classes['layers']}>
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
                      name="selectedBaseMap"
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
      <List>
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

  render () {
    return (
      <div className={classes['LayerSwitcher']}>
        <div className={classes['Tabs']}>
          <Tabs>
            <Tab
              icon={<FontIcon className="material-icons">satellite</FontIcon>}
              label="Datasets">
              <Paper zDepth={2}>
                <h2>Datasets</h2>
                {this.makeDatasetsList()}
              </Paper>
            </Tab>
            <Tab
              icon={<FontIcon className="material-icons">local_library</FontIcon>}
              label="Shape Files">
              <Paper zDepth={2}>
                <h2>Shape Files</h2>
                {this.makeShapefileList()}
              </Paper>
            </Tab>
            <Tab
              icon={<FontIcon className="material-icons">map</FontIcon>}
              label="Base Maps">
              <Paper zDepth={2}>
                <h2>Base Maps</h2>
                {this.makeBaseMapsList()}
              </Paper>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}
