import React from 'react';
import PropTypes from 'prop-types';
import classes from './Table.scss'
class Table extends React.Component {
  render() {
    return (
      <div className={classes['Table']}>
        <table>
          {this.props.children}
        </table>
      </div>
    );
  }
}
export default Table
