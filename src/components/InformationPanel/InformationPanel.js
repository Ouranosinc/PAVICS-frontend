import React from 'react';
import * as classes from './InformationPanel.scss';
import * as constants from './../../constants';
import Loader from './../../components/Loader';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui/svg-icons/action/description';
import MinimizeIcon from 'material-ui/svg-icons/content/remove';

export default class InformationPanel extends React.Component {
  static propTypes = {
    onToggleMapPanel: React.PropTypes.func.isRequired,
    currentScalarValue: React.PropTypes.object.isRequired
  };

  constructor () {
    super();
    this._onHideInformationPanel = this._onHideInformationPanel.bind(this);
  }

  _onHideInformationPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_INFO_PANEL);
  }

  render () {
    let mainComponent = null;
    if (this.props.currentScalarValue.isFetching) {
      mainComponent = <Loader name="informations" />;
    } else if (this.props.currentScalarValue.data && this.props.currentScalarValue.data.variable) {
      mainComponent =
        <Table selectable={false} className={classes['Table']}>
          <TableHeader
            adjustForCheckbox={false}
            displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Key</TableHeaderColumn>
              <TableHeaderColumn>Value</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              Object.keys(this.props.currentScalarValue.data.variable).map((key, i) => {
                if (key === '_indices') {
                  let values = this.props.currentScalarValue.data.variable[key];
                  return (
                    <TableRow key={i}>
                      <TableRowColumn>indices</TableRowColumn>
                      <TableRowColumn>lat: {values.lat}, lon: {values.lon}, time: {values.time}</TableRowColumn>
                    </TableRow>
                  );
                } else if (key === 'value') {
                  return (
                    <TableRow key={i}>
                      <TableRowColumn>{key}</TableRowColumn>
                      <TableRowColumn>{this.props.currentScalarValue.data.variable[key].toExponential()}</TableRowColumn>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={i}>
                      <TableRowColumn>{key}</TableRowColumn>
                      <TableRowColumn>{this.props.currentScalarValue.data.variable[key]}</TableRowColumn>
                    </TableRow>
                  );
                }
              })
            }
          </TableBody>
        </Table>;
    }
    return (
      <Paper className={classes['InformationPanel']}>
        <AppBar
          title="Informations"
          iconElementLeft={<IconButton><InfoIcon /></IconButton>}
          iconElementRight={<IconButton><MinimizeIcon onTouchTap={(event) => this._onHideInformationPanel()} /></IconButton>} />
        <div className={classes['Content']}>
          {mainComponent}
        </div>
      </Paper>
    );
  }
}
