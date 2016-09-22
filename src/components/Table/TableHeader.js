import React from 'react'
class TableHeader extends React.Component {
  static propTypes = {
    fields: React.PropTypes.array.isRequired,
  };

  render() {
    return (
      <thead>
      <tr>
        {
          this.props.fields.map((value, i) => <th key={i}>{value}</th>)
        }
      </tr>
      </thead>
    );
  }
}
export default TableHeader
