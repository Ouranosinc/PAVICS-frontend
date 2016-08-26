import React from 'react'
import classes from './ToggleButton.scss'

export class ToggleButton extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this._toggleClicked = this._toggleClicked.bind(this);
  }

  _toggleClicked(){
    this.props.onClick();
  }

  render () {
    return (
      <a onClick={ this._toggleClicked } className={classes['ToggleButton']} href="#">
        <i className={classes.toggleIcon + " glyphicon " + this.props.icon}></i>
      </a>
    )
  }
}

export default ToggleButton
