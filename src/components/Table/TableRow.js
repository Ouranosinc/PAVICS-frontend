import React from 'react';
import PropTypes from 'prop-types';

class TableRow extends React.Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
    selected: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <tr className={this.props.selected ? 'selected' : ''}>
        {
          this.props.fields.map((value, i) => <td key={i}>{value}</td>)
        }
      </tr>
    );
  }
}
export default TableRow
