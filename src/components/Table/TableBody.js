import React from 'react'
import TableRow from './TableRow'
import style from './Table.scss'
class TableBody extends React.Component {
  static propTypes = {
    rows: React.PropTypes.array.isRequired,
    selectedIndex: React.PropTypes.number.isRequired,
  }

  render () {
    return (
      <tbody className={style['overflowable']}>
      {
        this.props.rows.map((row, i) =>
          <TableRow key={i} selected={this.props.selectedIndex === i} fields={row} />)
      }
      </tbody>
    )
  }
}
export default TableBody
