import React from 'react';
import PropTypes from 'prop-types';
import classes from './SectionalPanel.scss';
import AppBar from'@material-ui/core/AppBar';
import IconButton from'@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="title" color="inherit" style={{flex: 1}}>
                {this.props.title}
              </Typography>
              <IconButton><InfoIcon /></IconButton>
            </Toolbar>
          </AppBar>
          {this.props.currentContent}
        </div>
      </div>
    );
  }
}
export default SectionalContent;
