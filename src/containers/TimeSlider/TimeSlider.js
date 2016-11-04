import React from 'react'
import { connect } from 'react-redux'
import classes from './TimeSlider.scss'
import ReactBootstrapSlider from 'react-bootstrap-slider';
import * as constants from './../../routes/Visualize/constants'
import Loader from '../../components/Loader'

export class TimeSlider extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
  }


  render() {
    return(
      <div className={classes['TimeSlider']}>
        <ReactBootstrapSlider
          range = { true }
          step = { 1 }
          endValue = { 8 }
          startValue= { 1 }
          ticks = {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          ticks_labels = {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]}
          ticks_snap_bounds = { 10 } />
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
)(TimeSlider)
