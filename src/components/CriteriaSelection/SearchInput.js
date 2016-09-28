import React from 'react'
class SearchInput extends React.Component {
  static propTypes = {
    onChangeCb: React.PropTypes.func.isRequired,
  };
  render() {
    return (
      <input onChange={this.props.onChangeCb} type="text" />
    );
  }
}
export default SearchInput
