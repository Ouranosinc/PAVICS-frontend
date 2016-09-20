import React from 'react'
class SelectableTableRow extends React.Component {
  static propTypes = {
    fields: React.PropTypes.array.isRequired,
    onSelectCb: React.PropTypes.func.isRequired,
    value: React.PropTypes.string.isRequired,
  };

  render() {
    return (
      <tr>
        <td><input type="checkbox" value={this.props.value} onChange={this.props.onSelectCb}/></td>
        {
          this.props.fields.map((value, i) => <td key={i}>{value}</td>)
        }
      </tr>
    );
  }
}
export default SelectableTableRow
