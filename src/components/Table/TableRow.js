import React from 'react'
class TableRow extends React.Component {
  static propTypes = {
    fields: React.PropTypes.array.isRequired,
  };

  render() {
    return (
      <tr>
        {
          this.props.fields.map((value, i) => <td key={i}>{value}</td>)
        }
      </tr>
    );
  }
}
export default TableRow
