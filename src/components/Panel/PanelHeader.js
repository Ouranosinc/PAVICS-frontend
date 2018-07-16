import React from 'react';
import PropTypes from 'prop-types';
import {ToggleButton} from '../Panel'
import style from './Panel.scss'
class PanelHeader extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    panelIsActive: PropTypes.bool.isRequired,
    children: PropTypes.any
  }

  render () {
    return (
      <React.Fragment>
        <ToggleButton onClick={this.props.onClick} icon={this.props.icon} />
        {
          this.props.panelIsActive
            ? <span className={style['header']}>{this.props.children}</span>
            : null
        }
      </React.Fragment>
    )
  }
}
export default PanelHeader
