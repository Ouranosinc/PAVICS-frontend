import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  <%= pascalEntityName %>: {

  }
});


export class <%= pascalEntityName %> extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <div className={this.props.classes['<%= pascalEntityName %>']}>
        <h1><%= pascalEntityName %></h1>
      </div>
    )
  }
}

export default withStyles(styles)(<%= pascalEntityName %>);
