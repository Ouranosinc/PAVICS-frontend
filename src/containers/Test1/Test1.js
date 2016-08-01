import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classes from './Test1.scss'

var me;

export class Test1 extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    me = this;
  }


  render () {
    return (
      <div className={classes['Test1']}>
        <h1>Test1</h1>
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
)(Test1)
