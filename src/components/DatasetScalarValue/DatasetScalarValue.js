import React from 'react';
import Divider from 'material-ui/Divider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
export default class DatasetScalarValue extends React.Component {
  static propTypes = {
    json: React.PropTypes.object.isRequired
  };
  render () {
    return (
      <div>
        <h3>Point Result Data</h3>
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
              Object.keys(this.props.json).map((key, i) => {
                if (key === '_indices') {
                  let values = this.props.json[key];
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
                      <TableRowColumn>{this.props.json[key].toExponential()}</TableRowColumn>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={i}>
                      <TableRowColumn>{key}</TableRowColumn>
                      <TableRowColumn>{this.props.json[key]}</TableRowColumn>
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
