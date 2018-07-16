import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from'@material-ui/core/Paper';
import AppBar from'@material-ui/core/AppBar';
import IconButton from'@material-ui/core/IconButton';
import MinimizeIcon from '@material-ui/icons/Remove';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({});


export class VisualizeWidget extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    classes: PropTypes.object.isRequired,
    icon: PropTypes.object.isRequired,
    onMinimizeClicked: PropTypes.func.isRequired,
    rootStyle: PropTypes.object,
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render () {
    const { children, icon, onMinimizeClicked, rootStyle, title } = this.props;
    return (
      <Paper style={rootStyle}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton disableRipple color="inherit">{icon}</IconButton>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              {title}
            </Typography>
            <IconButton color="inherit" className="cy-minimize-btn" onClick={(event) => onMinimizeClicked()}><MinimizeIcon /></IconButton>
          </Toolbar>
        </AppBar>
        {children}
      </Paper>
    )
  }
}

export default withStyles(styles)(VisualizeWidget);
