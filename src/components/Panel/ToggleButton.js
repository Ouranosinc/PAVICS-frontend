import React from 'react'
import classes from './Panel.scss'
export class ToggleButton extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <a onClick={ this.props.onClick } className={classes['ToggleButton']} href="#">
        <i className={classes['toggleIcon'] + " glyphicon " + this.props.icon}/>
      </a>
    )
  }
}
export default ToggleButton
