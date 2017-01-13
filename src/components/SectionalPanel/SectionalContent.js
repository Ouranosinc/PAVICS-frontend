import React from 'react';
import classes from './SectionalPanel.scss';

class SectionalContent extends React.Component {
  static propTypes = {
    currentContent: React.PropTypes.object,
    showContent: React.PropTypes.bool.isRequired
  };

  render () {
    return (
      <div className={classes['SectionalContent']}>
        <div className={(this.props.showContent) ? classes['ShownContent'] : classes['HiddenContent']}>
          {this.props.currentContent}
        </div>
      </div>
    );
  }
}
export default SectionalContent;
