import React from 'react'
import classes from './DatasetDetails.scss'

import Loader from '../../components/Loader'

var me;

export class DatasetDetails extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    me = this;
  }


  render () {
    let MainComponent;
    if(this.props.selectedDatasets.isFetching){
      MainComponent = <Loader name="dataset" />
    }else{
      if(this.props.selectedDatasets.items.length){
        MainComponent =
          <div className={classes['DatasetTable']}>
            <table>
              <thead>
              <tr>
                <th>Resource title</th>
                <th>OpenDAP</th>
                <th>HTTP</th>
                <th>WMS</th>
              </tr>
              </thead>
              <tbody>
              {
                this.props.selectedDatasets.items[0].datasets.map((x) =>
                <tr key={x.name}>
                  <td>{ x.name }</td>
                  { this.renderLink(x.services.find( x=> x.type === "OpenDAP"), "View") }
                  { this.renderLink(x.services.find( x=> x.type === "HTTPServer"), "Download") }
                  { this.renderLink(x.services.find( x=> x.type === "WMS"), "Load") }
                </tr>
                )
              }
              </tbody>
            </table>
          </div>
      }else{
        MainComponent = null;
      }

    }
    return (
      <div className={classes['DatasetDetails']}>
        <h3>Dataset details</h3>
        { MainComponent }
      </div>
    )
  }

  renderLink(service, label) {
    if(service) return <td><a target="_blank" href={ service.url }>{ label }</a></td>
    else return <td>N/A</td>;
  }
}

export default DatasetDetails
