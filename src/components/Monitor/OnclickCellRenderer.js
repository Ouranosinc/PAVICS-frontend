import React from 'react';
class OnclickCellRenderer extends React.Component {
  static propTypes = {
    value: React.PropTypes.string
  };
  click = () => {
    this.props.value.onclick(this.props.value.param);
  };
  render () {
    return (
      <span onClick={this.click}>Visualize</span>
    );
  }
}
export default OnclickCellRenderer;
