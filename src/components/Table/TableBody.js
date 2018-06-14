import React from 'react';
import PropTypes from 'prop-types';

import TableRow from './TableRow'
import style from './Table.scss'
class TableBody extends React.Component {
  static propTypes = {
    rows: PropTypes.array.isRequired,
    selectedIndex: PropTypes.number.isRequired,
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
