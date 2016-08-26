import React from 'react'
import classes from './DatasetDetails.scss'
import Loader from '../../components/Loader'
import ToggleButton from '../../components/ToggleButton'

export class DatasetDetails extends React.Component {
  static propTypes = {
    //selectedWMSLayers: React.PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this._loadWmsDatasetLayer = this._loadWmsDatasetLayer.bind(this);
  }

  _loadWmsDatasetLayer(url, name) {
    //this.props.selectLoadWmsLayer(url, name);
  }

  render () {
    return (
      <div className={classes['DatasetWMSLayers']}>
        <div className={classes['Table']}>
          <table>
            <thead>
            <tr>
              <th className={classes['NameColumn']}>Layer name</th>
              <th className={classes['SelectColumn']}>Select</th>
            </tr>
            </thead>
            <tbody>
            {
              this.props.selectedWMSLayers.items.map((x) =>
                <tr key={x.name}>
                  <td>{ x.name }</td>
                  { (x.services.find( x=> x.type === "WMS")) ?
                    <td><a href="#" onClick={() => this._loadWmsDatasetLayer(x.url, x.name)}>Load</a></td>:
                    <td>N/A</td>
                  }
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default DatasetDetails
