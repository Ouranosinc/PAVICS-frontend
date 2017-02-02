import React, { Component, PropTypes } from 'react';
import classes from './Loader.scss';
import RefreshIndicator from 'material-ui/RefreshIndicator';

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
        <RefreshIndicator
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
