import React from 'react'
import TableRow from './TableRow'
class TableBody extends React.Component {
  static propTypes = {
    rows: React.PropTypes.array.isRequired,
    selectedIndex: React.PropTypes.number.isRequired,
  };
  render()
  {
    return (
      <tbody>
        {
          this.props.rows.map((row, i) =>
            <TableRow key={i} selected={this.props.selectedIndex === i} fields={row}/>)
        }
      </tbody>
    );
  }
}
export  default TableBody
