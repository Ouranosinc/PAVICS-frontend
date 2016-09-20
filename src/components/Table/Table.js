import React from 'react'
import classes from './Table.scss'
class Table extends React.Component {
  static propTypes = {
    cellHeaders: React.PropTypes.array.isRequired,
    rows: React.PropTypes.array.isRequired,
    selectedIndex: React.PropTypes.number.isRequired,
  };

  render() {
    return (
      <div className={classes['Table']}>
        <table>
          <thead>
          <tr>
            {
              this.props.cellHeaders.map((header, i) =>
                <th key={i}>{header}</th>
              )
            }
          </tr>
          </thead>
          <tbody>
          {
            this.props.rows.map((row, i) =>
              <tr key={i} className={i === this.props.selectedIndex ? classes.selected : ''}>{
                row.map((cell, j) =>
                  <td key={j}> {cell} </td>
                )
              }
              </tr>
            )
          }
          </tbody>
        </table>
      </div>
    );
  }
}
export default Table
