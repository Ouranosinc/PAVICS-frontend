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
      <React.Fragment>
        <div className={classes.mainContainer}>
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default CoreLayout;
