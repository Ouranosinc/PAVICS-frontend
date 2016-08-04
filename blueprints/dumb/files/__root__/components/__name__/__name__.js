import React from 'react'
import classes from './<%= pascalEntityName %>.scss'

var me;

export class <%= pascalEntityName %> extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    me = this;
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
