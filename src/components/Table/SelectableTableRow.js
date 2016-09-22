import React from 'react'
class SelectableTableRow extends React.Component {
  static propTypes = {
    fields: React.PropTypes.array.isRequired,
    onChangeCb: React.PropTypes.func.isRequired,
    value: React.PropTypes.string.isRequired,
    checked: React.PropTypes.bool.isRequired,
  };

  render() {
    return (
      <tr>
        <td>
          <input
            checked={this.props.checked ? 'checked' : ''}
            type="checkbox"
            value={this.props.value}
            onChange={this.props.onChangeCb}/>
        </td>
        {
          this.props.fields.map((value, i) => <td key={i}>{value}</td>)
        }
      </tr>
    );
  }
}
export default SelectableTableRow
