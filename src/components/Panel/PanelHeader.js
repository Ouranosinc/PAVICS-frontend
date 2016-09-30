import React from 'react'
import {ToggleButton} from '../Panel'
import style from './Panel.scss'
class PanelHeader extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string.isRequired,
    panelIsActive: React.PropTypes.bool.isRequired,
    children: React.PropTypes.any
  }

  render () {
    return (
      <div>
        <ToggleButton onClick={this.props.onClick} icon={this.props.icon} />
        {
          this.props.panelIsActive
            ? <span className={style['header']}>{this.props.children}</span>
            : null
        }
      </div>
    )
  }
}
export default PanelHeader
