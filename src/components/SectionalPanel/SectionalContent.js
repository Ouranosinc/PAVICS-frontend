import React from 'react';
import classes from './SectionalPanel.scss';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui/svg-icons/action/info';

class SectionalContent extends React.Component {
  static propTypes = {
    currentContent: React.PropTypes.object,
    showContent: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
  };

  render () {
    return (
      <div className={classes['SectionalContent']}>
        <div className={(this.props.showContent) ? classes['ShownContent'] : classes['HiddenContent']}>
          <AppBar
            title={this.props.title}
            iconElementRight={<IconButton><InfoIcon /></IconButton>}
            showMenuIconButton={false}
          />
          {this.props.currentContent}
        </div>
      </div>
    );
  }
}
export default SectionalContent;
