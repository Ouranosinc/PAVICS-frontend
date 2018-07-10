import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from './Loader.scss';
import CircularProgress from'@material-ui/core/CircularProgress';

export class Loader extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className={classes['Loader']}>
        <CircularProgress
          size={40}
          left={0}
          top={0}
          status="loading"
          style={{display: 'inline-block', position: 'relative'}} />
      </div>
    );
  }
}

export default Loader;
