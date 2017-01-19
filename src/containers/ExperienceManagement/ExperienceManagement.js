import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classes from './ExperienceManagement.scss'

export class ExperienceManagement extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <div className={classes['ExperienceManagement']}>
        ExperienceManagement (TODO)
      </div>
    );
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
)(ExperienceManagement)
