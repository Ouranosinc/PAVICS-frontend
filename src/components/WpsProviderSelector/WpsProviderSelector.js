import React from 'react';
import PropTypes from 'prop-types';
import List from'@material-ui/core/List';
import ListItem from'@material-ui/core/ListItem';
import ListItemIcon from'@material-ui/core/ListItemIcon';
import ListItemText from'@material-ui/core/ListItemText';
import Paper from'@material-ui/core/Paper';
import ProviderIcon from '@material-ui/icons/PermDataSetting';
export default class WpsProviderSelector extends React.Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired
  };

  makeChangeProviderCallback (identifier) {
    return () => {
      this.props.workflowActions.selectWpsProvider(identifier);
    };
  }

  render () {
    return (
      <Paper elevation={2}>
        <List>
          {
            this.props.workflow.providers.items.map((provider, i) => {
              return (
              <ListItem
                button
                onClick={this.makeChangeProviderCallback(provider.identifier)}
                key={i}>
                <ListItemIcon>
                  <ProviderIcon />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={provider.title}
                  secondary={provider.description} />
              </ListItem>
              );
            })
          }
        </List>
      </Paper>
    );
  }
}
