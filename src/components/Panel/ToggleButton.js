import React from 'react';
import PropTypes from 'prop-types';
import classes from './Panel.scss'
export class ToggleButton extends React.Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
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
