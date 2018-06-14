import React from 'react';
import PropTypes from 'prop-types';
import classes from './SectionalPanel.scss';
import AppBar from'@material-ui/core/AppBar';
import IconButton from'@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

class SectionalContent extends React.Component {
  static propTypes = {
    currentContent: PropTypes.object,
    showContent: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
  };

  render () {
    return (
      <div className={classes['SectionalContent']}>
        <div id="cy-sectional-content" className={(this.props.showContent) ? classes['ShownContent'] : classes['HiddenContent']}>
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
