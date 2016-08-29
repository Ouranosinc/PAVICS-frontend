import React from 'react'
import classes from './DatasetWMSLayersPicker.scss'

var me;

export class DatasetWMSLayersPicker extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    me = this;
  }


  render () {
    return (
      <div className={classes['DatasetWMSLayersPicker']}>
        <h1>DatasetWMSLayersPicker</h1>
      </div>
    )
  }
}

export default DatasetWMSLayersPicker
