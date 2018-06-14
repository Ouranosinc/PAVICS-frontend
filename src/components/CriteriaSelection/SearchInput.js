import React from 'react';
import PropTypes from 'prop-types';

class SearchInput extends React.Component {
  static propTypes = {
    onChangeCb: PropTypes.func.isRequired,
  };
  render() {
    return (
      <input onChange={this.props.onChangeCb} type="text" />
    );
  }
}
export default SearchInput
