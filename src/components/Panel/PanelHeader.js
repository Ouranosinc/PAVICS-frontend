import React from 'react'
import {ToggleButton} from '../Panel'
import style from './Panel.scss'
class PanelHeader extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string.isRequired,
  };
  render()
  {
    return (
      <div>
        <ToggleButton onClick={this.props.onClick} icon={this.props.icon}/>
        <span className={style['header']}>{this.props.children}</span>
      </div>
    );
  }
}
export default PanelHeader
