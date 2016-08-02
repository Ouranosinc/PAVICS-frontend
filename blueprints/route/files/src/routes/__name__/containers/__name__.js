import React from 'react'
import { connect } from 'react-redux'
import classes from './<%= pascalEntityName %>.scss'
import { asyncFetchAnys } from '../modules/<%= pascalEntityName %>'

let me;

class <%= pascalEntityName %> extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.props.asyncFetchAnys();
    me = this;
  }

  render () {
    return (
      <div className={classes['<%= pascalEntityName %>']}>
        <h1>Test props</h1>
      </div>
    )
  }
}

const mapActionCreators = {
  asyncFetchAnys
}

const mapStateToProps = (state) => ({
  variable: state.variable
})

export default connect(mapStateToProps, mapActionCreators)(<%= pascalEntityName %>)
