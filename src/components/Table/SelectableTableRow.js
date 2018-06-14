import React from 'react';
import PropTypes from 'prop-types';

class SelectableTableRow extends React.Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
    onChangeCb: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
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
