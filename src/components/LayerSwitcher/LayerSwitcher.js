import React from 'react';
import * as classes from './LayerSwitcher.scss';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
export default class LayerSwitcher extends React.Component {
  static propTypes = {
    publicShapeFiles: React.PropTypes.array.isRequired,
    baseMaps: React.PropTypes.array.isRequired,
    removeShapeFile: React.PropTypes.func.isRequired,
    setShapeFile: React.PropTypes.func.isRequired,
    removeBaseMap: React.PropTypes.func.isRequired,
    setBaseMap: React.PropTypes.func.isRequired
  };

  constructor () {
    super();
    this.state = {
      selectedShapeFile: '',
      selectedBaseMap: ''
    };
    this.setSelectedShapeFile = this.setSelectedShapeFile.bind(this);
    this.setSelectedBaseMap = this.setSelectedBaseMap.bind(this);
  }

  setSelectedShapeFile (event, value) {
    console.log('radio clicked:', event);
    if (this.state.selectedShapeFile === value) {
      this.props.removeShapeFile(value);
      this.setState({
        selectedShapeFile: '',
        selectedBaseMap: this.state.selectedBaseMap
      });
    } else {
      // when setting baseMap from outside (on mounting visualize) we don't want to remove a null base map
      // it's not so bad if we do, but I am paranoid
      if (this.state.selectedBaseMap !== '') {
        this.props.removeShapeFile(this.state.selectedShapeFile);
      }
      this.props.setShapeFile(value);
      this.setState({
        selectedShapeFile: value,
        selectedBaseMap: this.state.selectedBaseMap
      });
    }
  }

  setSelectedBaseMap (event, value) {
    console.log('radio clicked:', event);
    if (this.state.selectedBaseMap === value) {
      this.props.removeBaseMap(value);
      this.setState({
        selectedShapeFile: this.state.selectedShapeFile,
        selectedBaseMap: ''
      });
    } else {
      this.props.removeBaseMap(this.state.selectedBaseMap);
      this.props.setBaseMap(value);
      this.setState({
        selectedShapeFile: this.state.selectedShapeFile,
        selectedBaseMap: value
      });
    }
  }

  makeNestedPublicShapeFiles () {
    let items = [];
    this.props.publicShapeFiles.map((shapeFile, i) => {
      items.push(
        <ListItem
          primaryText={shapeFile.title}
          key={i}
          leftCheckbox={
            <RadioButtonGroup
              name="selectedShapeFile"
              valueSelected={this.state.selectedShapeFile}
              onChange={this.setSelectedShapeFile}>
              <RadioButton value={shapeFile} />
            </RadioButtonGroup>
          }
        />
      );
    });
    return items;
  }

  makeNestedBaseMaps () {
    let items = [];
    this.props.baseMaps.map((map, i) => {
      items.push(
        <ListItem
          primaryText={map}
          key={i}
          leftCheckbox={
            <RadioButtonGroup
              name="selectedBaseMap"
              valueSelected={this.state.selectedBaseMap}
              onChange={this.setSelectedBaseMap}>
              <RadioButton value={map} />
            </RadioButtonGroup>
          }
        />
      );
    });
    return items;
  }

  makeShapeFilesList () {
    return (
      <List className={classes['layers']}>
        <ListItem
          initiallyOpen
          primaryTogglesNestedList
          primaryText="Public"
          nestedItems={this.makeNestedPublicShapeFiles()} />
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
          nestedItems={this.makeNestedBaseMaps()} />
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
              </Paper>
            </Tab>
            <Tab
              icon={<FontIcon className="material-icons">local_library</FontIcon>}
              label="Shape Files">
              <Paper zDepth={2}>
                <h2>Shape Files</h2>
                {this.makeShapeFilesList()}
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
