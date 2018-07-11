import React from 'react';
import PropTypes from 'prop-types';
import * as classes from './InformationPanel.scss';
import * as constants from './../../constants';
import Loader from './../../components/Loader';
import Table from'@material-ui/core/Table';
import TableBody from'@material-ui/core/TableBody';
import TableHead from'@material-ui/core/TableHead';
import TableCell from'@material-ui/core/TableCell';
import TableRow from'@material-ui/core/TableRow';
import {Alert} from 'react-bootstrap';
import Paper from'@material-ui/core/Paper';
import AppBar from'@material-ui/core/AppBar';
import Toolbar from'@material-ui/core/Toolbar';
import Typography from'@material-ui/core/Typography';
import IconButton from'@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Description';
import MinimizeIcon from '@material-ui/icons/Remove';

export default class InformationPanel extends React.Component {
  static propTypes = {
    onMinimizeClicked: PropTypes.func.isRequired,
    currentScalarValue: PropTypes.object.isRequired
  };

  constructor () {
    super();
  }

  render () {
    let content = null;
    if (this.props.currentScalarValue.isFetching) {
      content = <Loader name="informations" />;
    } else if (this.props.currentScalarValue.data && this.props.currentScalarValue.data.variable) {
      content =
        <Table selectable={false} className={classes['Table']}>
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
              Object.keys(this.props.currentScalarValue.data.variable).map((key, i) => {
                if (key === '_indices') {
                  let values = this.props.currentScalarValue.data.variable[key];
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
                      <TableCell>{this.props.currentScalarValue.data.variable[key].toExponential()}</TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={i}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{this.props.currentScalarValue.data.variable[key]}</TableCell>
                    </TableRow>
                  );
                }
              })
            }
          </TableBody>
        </Table>;
    } else if (!this.props.currentScalarValue.data || !this.props.currentScalarValue.data._dimensions) {
      content =
        <Alert bsStyle="info" style={{marginTop: 20}}>
          A dataset must first be selected. Then a point must be clicked on the map with the map controls mode 'Point scalar values' activated for scalar value to be calculated.
        </Alert>;
    };
    return (
      <Paper className={classes['InformationPanel']}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton disableRipple color="inherit"><InfoIcon /></IconButton>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              Point Informations
            </Typography>
            <IconButton color="inherit" className="cy-minimize-btn" onClick={(event) => this.props.onMinimizeClicked()}><MinimizeIcon /></IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes['Content']}>
          {content}
        </div>
      </Paper>
    );
  }
}
