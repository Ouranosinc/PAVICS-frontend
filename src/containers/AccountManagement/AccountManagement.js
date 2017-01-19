import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classes from './AccountManagement.scss'

var me;

export class AccountManagement extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    me = this;
  }


  render () {
    return (
      <div className={classes['AccountManagement']}>
        AccountManagement (TODO)
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
)(AccountManagement)
