import React from 'react'
import classes from './DatasetDetails.scss'
import Loader from '../../components/Loader'
import ToggleButton from '../../components/ToggleButton'

export class DatasetDetails extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    this._loadWmsDataset = this._loadWmsDataset.bind(this);
    this._onCloseDatasetDetailsPanel = this._onCloseDatasetDetailsPanel.bind(this);
    this._onOpenDatasetDetailsPanel = this._onOpenDatasetDetailsPanel.bind(this);
  }

  _loadWmsDataset(url, name) {
    this.props.selectLoadWms(url, this.props.selectedDatasets.items[0].id, name);
  }

  _onCloseDatasetDetailsPanel(){
    this.props.clickTogglePanel("datasetDetailsPanel", false);
  }

  _onOpenDatasetDetailsPanel(){
    this.props.clickTogglePanel("datasetDetailsPanel", true);
  }

  render () {
    let DatasetDetailsPanel;
    if(this.props.panelControls.datasetDetailsPanel.show){
      let MainComponent;
      if(this.props.selectedDatasets.isFetching){
        MainComponent = <Loader name="dataset" />
      }else{
        if(this.props.selectedDatasets.items.length){
          MainComponent =
            <div>
              <div className={classes['DatasetMetadatas']}>
                {
                  this.props.selectedDatasets.items[0].metadatas.map((x) =>
                    <div key={x.key + x.value}><strong>{ x.key }: </strong>{ x.value } </div>,
                  )
                }
              </div>
              <div className={classes['DatasetTable']}>
                <table>
                  <thead>
                  <tr>
                    <th className={classes['DatasetTableResourceTitleColumn']}>Resource title</th>
                    <th className={classes['DatasetTableSizeColumn']}>Size</th>
                    <th className={classes['DatasetTableOpenDAPColumn']}>OpenDAP</th>
                    <th className={classes['DatasetTableHTTPColumn']}>HTTP</th>
                    <th className={classes['DatasetTableWMSColumn']}>WMS</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.props.selectedDatasets.items[0].datasets.map((x) =>
                      <tr key={x.name}>
                        <td>{ x.name }</td>
                        <td>{ x.size.replace("bytes", "") }</td>
                        { this.renderLink(x.services.find( x=> x.type === "OpenDAP"), "View") }
                        { this.renderLink(x.services.find( x=> x.type === "HTTPServer"), "Download") }
                        { (x.services.find( x=> x.type === "WMS")) ?
                          <td><a href="#" onClick={() => this._loadWmsDataset(x.services.find( x=> x.type === "WMS").url, x.name)}>Load</a></td>:
                          <td>N/A</td>
                        }
                      </tr>
                    )
                  }
                  </tbody>
                </table>
              </div>
            </div>
        }else{
          MainComponent = null;
        }
        DatasetDetailsPanel =  <div className={classes.datasetDetailsComponent + " col-sm-5 col-md-6 col-lg-7"}>
          <div className={classes.overlappingBackground + " panel panel-default"}>
            <h3><ToggleButton onClick={this._onCloseDatasetDetailsPanel} icon="glyphicon-list-alt"/> Dataset details</h3>
            <div className="panel-body">
              { MainComponent }
            </div>
          </div>
        </div>
      }
    }else{
      DatasetDetailsPanel = <div className={classes.datasetDetailsComponent}>
        <div className={classes.overlappingBackground + " " + classes.togglePanel + " panel panel-default"}>
          <ToggleButton onClick={this._onOpenDatasetDetailsPanel} icon="glyphicon-list-alt"/>
        </div>
      </div>;
    }
    return (
      <div className={classes['DatasetDetails']}>
        { DatasetDetailsPanel }
      </div>
    )
  }

  renderLink(service, label) {
    if(service){
      return <td><a target="_blank" href={ service.url }>{ label }</a></td>
    }
    else{
      return <td>N/A</td>;
    }
  }
}

export default DatasetDetails
