import React from 'react';
class LinkCellRenderer extends React.Component {
  static propTypes = {
    value: React.PropTypes.string
  };
  render () {
    return (
      <a target="_blank" href={this.props.value}>results</a>
    );
  }
}
export default LinkCellRenderer;
