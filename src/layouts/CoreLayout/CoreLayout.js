import React from 'react';
import PropTypes from 'prop-types';
import classes from './CoreLayout.scss';
import '../../styles/core.scss';

class CoreLayout extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };
  render () {
    return (
      <div>
        <div className={classes.mainContainer}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default CoreLayout;
