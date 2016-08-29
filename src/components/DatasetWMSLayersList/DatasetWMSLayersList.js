import React, { Component, PropTypes } from 'react'
import classes from './DatasetWMSLayersList.scss'

import Loader from '../../components/Loader'

export class DatasetWMSLayersList extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    currentLayer: PropTypes.string.isRequired,
    layers: PropTypes.array.isRequired,
    onSelectLayer: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this._onSelectLayer = this._onSelectLayer.bind(this);
  }

  _onSelectLayer(url, layer){
    this.props.onSelectLayer(url, layer);
  }

  render () {
    if(this.props.isFetching){
      return <Loader name="dataset" />;
    }else {
      let MainComponent = null;
      if (this.props.layers.length) {
        MainComponent = <div className={classes['Table']}>
          <table>
            <thead>
            <tr>
              <th className={classes['NameColumn']}>Layer name</th>
              <th className={classes['SelectColumn']}>Select</th>
            </tr>
            </thead>
            <tbody>
            {
              this.props.layers.map((x) =>
                <tr key={x.name} className={ (x.name === this.props.currentLayer)? classes['SelectedRow']: ""}>
                  <td>{ x.name }</td>
                  <td><a href="#" onClick={() => this._onSelectLayer(x.wmsUrl, x.name)}>Select</a></td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
      }
      return (
        <div className={classes['DatasetWMSLayersList']}>
          {
            MainComponent
          }
        </div>
      )
    }

  }
}

export default DatasetWMSLayersList
