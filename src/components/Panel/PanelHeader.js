import React from 'react'
import {ToggleButton} from '../Panel'
class PanelHeader extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string.isRequired,
  };
  render()
  {
    return (
      <div>
        <h3><ToggleButton onClick={this.props.onClick} icon={this.props.icon}/>{this.props.children}</h3>
      </div>
    );
  }
}
export default PanelHeader
