import React from 'react';
import PropTypes from 'prop-types';
import Loader from './../../components/Loader';
import Table from'@material-ui/core/Table';
import TableBody from'@material-ui/core/TableBody';
import TableHead from'@material-ui/core/TableHead';
import TableCell from'@material-ui/core/TableCell';
import TableRow from'@material-ui/core/TableRow';

const styles = {
  content: {}
};

export default class InformationPanel extends React.Component {
  static propTypes = {
    visualize: PropTypes.object.isRequired
  };

  constructor () {
    super();
  }

  render () {
    const { currentScalarValue } = this.props.visualize;
    let content = null;
    if (currentScalarValue.isFetching) {
      content = <Loader name="informations" />;
    } else if (currentScalarValue.data && currentScalarValue.data.variable) {
      content =
        <Table selectable={false}>
          <TableHead
            adjustForCheckbox={false}
            displaySelectAll={false}>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody displayRowCheckbox={false}>
            {
              Object.keys(currentScalarValue.data.variable).map((key, i) => {
                if (key === '_indices') {
                  let values = currentScalarValue.data.variable[key];
                  return (
                    <TableRow key={i}>
                      <TableCell>indices</TableCell>
                      <TableCell>lat: {values.lat}, lon: {values.lon}, time: {values.time}</TableCell>
                    </TableRow>
                  );
                } else if (key === 'value') {
                  return (
                    <TableRow key={i}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{currentScalarValue.data.variable[key].toExponential()}</TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={i}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{currentScalarValue.data.variable[key]}</TableCell>
                    </TableRow>
                  );
                }
              })
            }
          </TableBody>
        </Table>;
    } else if (!currentScalarValue.data || !currentScalarValue.data._dimensions) {
      content = null;
    }
    return (
      <div style={styles.content}>
        {content}
      </div>
    );
  }
}
