import React from 'react';
import PropTypes from 'prop-types';
import {List, ListItem} from'@material-ui/core/List';
import Paper from'@material-ui/core/Paper';
import ProviderIcon from '@material-ui/icons/PermDataSetting';
export default class WpsProviderSelector extends React.Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired
  }

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
                <ListItem key={i}
                          onClick={this.makeChangeProviderCallback(provider.identifier)}
                          leftIcon={<ProviderIcon />}
                          secondaryTextLines={2}
                          primaryText={provider.title}
                          secondaryText={provider.description}>
                </ListItem>
              );
            })
          }
        </List>
      </Paper>
    );
  }
}
