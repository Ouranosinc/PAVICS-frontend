import React from 'react';
import Divider from 'material-ui/Divider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
export default class DatasetScalarValue extends React.Component {
  static propTypes = {
    opendapUrl: React.PropTypes.string.isRequired,
    pointResult: React.PropTypes.object.isRequired,
    fetchPlotlyData: React.PropTypes.func.isRequired,
    selectedDatasetCapabilities: React.PropTypes.object.isRequired
  };
  fetchPointResultGraph = () => {
    // TODO un hardcode time indices, should come from capabilities?
    this.props.fetchPlotlyData(
      this.props.opendapUrl,
      this.props.pointResult['name'],
      0,
      1000000000,
      this.props.pointResult['_indices']['lat'],
      this.props.pointResult['_indices']['lat'] + 1,
      this.props.pointResult['_indices']['lon'],
      this.props.pointResult['_indices']['lon'] + 1
    );
  };
  render () {
    return (
      <div>
        <RaisedButton onClick={this.fetchPointResultGraph} label="view as graph" />
        <Divider />
        <Table selectable={false}>
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
              Object.keys(this.props.pointResult).map((key, i) => {
                if (key === '_indices') {
                  let values = this.props.pointResult[key];
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
                      <TableRowColumn>{this.props.pointResult[key].toExponential()}</TableRowColumn>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={i}>
                      <TableRowColumn>{key}</TableRowColumn>
                      <TableRowColumn>{this.props.pointResult[key]}</TableRowColumn>
                    </TableRow>
                  );
                }
              })
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}
