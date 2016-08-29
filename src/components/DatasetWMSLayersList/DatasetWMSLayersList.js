import React from 'react'
import classes from './DatasetWMSLayersList.scss'

var me;

export class DatasetWMSLayersList extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    me = this;
  }


  render () {
    return (
      <div className={classes['DatasetWMSLayersList']}>
        <h1>DatasetWMSLayersList</h1>
      </div>
    )
  }
}

export default DatasetWMSLayersList
