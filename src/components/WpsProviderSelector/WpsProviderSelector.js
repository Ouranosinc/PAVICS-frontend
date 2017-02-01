import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
export default class WpsProviderSelector extends React.Component {
  static propTypes = {
    selectWpsProvider: React.PropTypes.func.isRequired,
    providers: React.PropTypes.object.isRequired
  }

  makeChangeProviderCallback (identifier) {
    return () => {
      this.props.selectWpsProvider(identifier);
    };
  }

  render () {
    return (
      <Paper zDepth={2}>
        <List>
          {
            this.props.providers.items.map((provider, i) => {
              return (
                <ListItem key={i} onClick={this.makeChangeProviderCallback(provider.identifier)}>
                  {provider.title}
                </ListItem>
              );
            })
          }
        </List>
      </Paper>
    );
  }
}
