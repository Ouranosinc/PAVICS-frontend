import React from 'react';
import PropTypes from 'prop-types';

class TableHeader extends React.Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
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
