import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import List from'@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from'@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/AddBox';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronRight from '@material-ui/icons/ChevronRight';
import transform from '../../util/transform';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  nested: {
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: theme.spacing.unit * 4,
  },
});

export class DatasetListedDetails extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    onCloseClicked: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render () {
    let cleaned = this.props.dataset;
    delete cleaned['uniqueLayerSwitcherId'];
    return (
      <Paper style={{ width: '80%', margin: 'auto'}}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              Dataset details
            </Typography>
            <IconButton color="inherit"
                        className="cy-close-btn"
                        onClick={(event) => this.props.onCloseClicked()}><CloseIcon /></IconButton>
          </Toolbar>
        </AppBar>
        <div style={{ height: '500px', overflowY: 'scroll'}}>
          <List>
            {
              Object.keys(this.props.dataset).map((key) =>
                <React.Fragment>
                  <ListItem component="div">
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText
                      inset
                      primary={transform.capitalize(transform.sanitize(key))}
                      secondary={
                        !Array.isArray(this.props.dataset[key]) &&
                        <span>{this.props.dataset[key]}</span>
                      } />
                  </ListItem>
                  {
                    Array.isArray(this.props.dataset[key]) &&
                    <List component="div" disablePadding>
                      {
                        this.props.dataset[key].map(v => {
                          return (
                            <ListItem className={this.props.classes.nested}>
                              <ListItemIcon>
                                <ChevronRight />
                              </ListItemIcon>
                              <ListItemText
                                inset
                                secondary={v}/>
                            </ListItem>
                          );
                        })
                      }
                    </List>
                  }
                </React.Fragment>
              )
            }
          </List>
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles)(DatasetListedDetails);
