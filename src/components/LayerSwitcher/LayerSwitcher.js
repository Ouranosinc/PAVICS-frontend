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
    removeShapeFile: React.PropTypes.func.isRequired,
    setShapeFile: React.PropTypes.func.isRequired
  };

  constructor () {
    super();
    this.state = {
      selectedShapeFile: ''
    };
    this.setSelectedShapeFile = this.setSelectedShapeFile.bind(this);
  }

  setSelectedShapeFile (event, value) {
    console.log('radio clicked:', event);
    if (this.state.selectedShapeFile === value) {
      this.props.removeShapeFile(value);
      this.setState({
        selectedShapeFile: ''
      });
    } else {
      this.props.setShapeFile(value);
      this.setState({
        selectedShapeFile: value
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
              name="selectShapeFile"
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
              </Paper>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}
