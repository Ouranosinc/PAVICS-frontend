import React from 'react'
import classes from './LoadingScreen.scss';
import Loader from './../Loader';

export class LoadingScreen extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <div className={classes['LoadingScreen']}>
        <div className={classes['Spinner']}>
          <Loader name=""></Loader>
        </div>
      </div>
    )
  }
}

export default LoadingScreen
