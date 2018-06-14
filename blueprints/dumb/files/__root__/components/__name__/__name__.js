import React from 'react';
import PropTypes from 'prop-types';
import classes from './<%= pascalEntityName %>.scss'

export class <%= pascalEntityName %> extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <div className={classes['<%= pascalEntityName %>']}>
        <h1><%= pascalEntityName %></h1>
      </div>
    )
  }
}

export default <%= pascalEntityName %>
