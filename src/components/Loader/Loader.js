import React, { Component, PropTypes } from 'react'
import classes from './Loader.scss'

var me;

export class Loader extends Component {
  static propTypes = {
    name : PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    me = this;
  }


  render () {
    return (
      <div className={classes['Loader']}>
        <img src="images/loading.gif" width="50" height="50" alt="Loading" />
        <span> Loading { this.props.name }...</span>
        <br />
      </div>
    )
  }
}

export default Loader
