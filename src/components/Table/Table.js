import React from 'react'
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
