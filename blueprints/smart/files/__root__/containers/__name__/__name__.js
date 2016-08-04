import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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

const mapStateToProps = (state) => {
  return {}
}
const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(<%= pascalEntityName %>)
