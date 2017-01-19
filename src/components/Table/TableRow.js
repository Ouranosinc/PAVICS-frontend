import React from 'react'
class TableRow extends React.Component {
  static propTypes = {
    fields: React.PropTypes.array.isRequired,
    selected: React.PropTypes.bool.isRequired,
  };

  render() {
    return (
      <tr className={this.props.selected ? 'selected' : ''}>
        {
          this.props.fields.map((value, i) => <td className="{'yolo'}" key={i}>{value}</td>)
        }
      </tr>
    );
  }
}
export default TableRow
