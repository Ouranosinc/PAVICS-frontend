import React from 'react';
import * as classes from './LayerSwitcher.scss';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
export default class LayerSwitcher extends React.Component {
  static propTypes = {
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedBasemap: React.PropTypes.string.isRequired,
    publicShapeFiles: React.PropTypes.array.isRequired,
    baseMaps: React.PropTypes.array.isRequired,
    removeShapeFile: React.PropTypes.func.isRequired,
    setShapeFile: React.PropTypes.func.isRequired,
    removeBaseMap: React.PropTypes.func.isRequired,
    setBaseMap: React.PropTypes.func.isRequired
  };

  constructor () {
    super();
    this.setSelectedShapefile = this.setSelectedShapefile.bind(this);
    this.setSelectedBaseMap = this.setSelectedBaseMap.bind(this);
  }

  setSelectedShapefile (event, value) {
    if (this.props.selectedShapefile === value) {
      this.props.removeShapeFile(value);
    } else {
      if (this.props.selectedShapefile !== {}) {
        this.props.removeShapeFile(this.props.selectedShapefile);
      }
      this.props.setShapeFile(value);
    }
  }

  setSelectedBaseMap (event, value) {
    if (this.props.selectedBasemap === value) {
      this.props.removeBaseMap(value);
    } else {
      this.props.removeBaseMap(this.props.selectedBasemap);
      this.props.setBaseMap(value);
    }
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
              valueSelected={this.props.selectedBasemap}
              onChange={this.setSelectedBaseMap}>
              <RadioButton value={map} />
            </RadioButtonGroup>
          }
        />
      );
    });
    return items;
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
