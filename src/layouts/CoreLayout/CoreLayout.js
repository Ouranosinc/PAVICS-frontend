import React from 'react';
import Header from '../../components/Header';
import classes from './CoreLayout.scss';
import '../../styles/core.scss';

class CoreLayout extends React.Component {
  static propTypes = {
    children: React.PropTypes.element.isRequired
  };
  render () {
    return (
      <div>
        <Header />
        <div className={classes.mainContainer}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default CoreLayout;
