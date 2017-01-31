import React from 'react';
import * as classes from './LayerSwitcher.scss';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
export default class LayerSwitcher extends React.Component {
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
