import React from 'react'
import classes from './DatasetDetails.scss'
import Loader from '../../components/Loader'
import TogglingPanel, {ToggleButton} from '../TogglingPanel'
import Table from '../Table'

export class DatasetDetails extends React.Component {
  static propTypes = {}

  constructor(props) {
    super(props);
    this._onOpenDatasetWmsLayers = this._onOpenDatasetWmsLayers.bind(this);
    this._onCloseDatasetDetailsPanel = this._onCloseDatasetDetailsPanel.bind(this);
  }

  /*_loadWmsDataset(url, name) {
   this.props.selectLoadWms(url, this.props.selectedDatasets.items[0].id, name);
   }*/

  _onOpenDatasetWmsLayers(url, dataset) {
    this.props.openDatasetWmsLayers(dataset);
    this.props.fetchDatasetWMSLayers(url, dataset);
    this.props.clickTogglePanel("DatasetDetails", false);
    this.props.clickTogglePanel("DatasetWMSLayers", true);
    /*this.props.selectLoadWms(url, this.props.selectedDatasets.items[0].id, dataset);*/
  }

  _onCloseDatasetDetailsPanel() {
    this.props.clickTogglePanel("DatasetDetails", false);
  }

  _mainComponent() {
        let MainComponent;
    if (this.props.selectedDatasets.isFetching) {
      MainComponent = <Loader name="dataset"/>
    } else {
      if (this.props.selectedDatasets.items.length) {
        let rows = [];
        let headers = [
          'Resource title',
          'Size',
          'OpenDAP',
          'HTTP',
          'WMS',
        ];
        let selectedIndex = -1;
        this.props.selectedDatasets.items[0].datasets.map((row, i) => {
          if (row.name === this.props.currentOpenedDatasetWMSFile)
          {
            selectedIndex = i;
          }
          rows[i] = [
            row.name,
            row.size.replace("bytes", ""),
            this.renderLink(row.services.find(row => row.type === "OpenDAP"), "View"),
            this.renderLink(row.services.find(row => row.type === "HTTPServer"), "Download"),
            (row.services.find(row => row.type === "WMS"))
              ? <a href="#" onClick={() => this._onOpenDatasetWmsLayers(row.services.find(row => row.type === "WMS").url, row.name)}>Open</a>
              : 'N/A'
          ];
        });


        MainComponent =
          <div>
            <div className={classes['DatasetMetadatas']}>
              {
                this.props.selectedDatasets.items[0].metadatas.map((x) =>
                  <div key={x.key + x.value}><strong>{ x.key }: </strong>{ x.value } </div>,
                )
              }
            </div>
            <Table cellHeaders={headers} rows={rows} selectedIndex={selectedIndex} />
          </div>
      } else {
        MainComponent = <span className="NotAvailable">You must first search catalogs then select a dataset.</span>;
      }
    }
    return MainComponent;
  }

  _opened() {
    return (
      <div className={classes.overlappingBackground + " panel panel-default"}>
        <h3><ToggleButton onClick={this._onCloseDatasetDetailsPanel} icon="glyphicon-list-alt"/> Dataset details
        </h3>
        <div className="panel-body">
          { this._mainComponent() }
        </div>
      </div>
    );
  }

  render() {
    return (
      <TogglingPanel
        clickTogglePanel={this.props.clickTogglePanel}
        classes={ classes }
        active={ this.props.panelControls.DatasetDetails.show }
        openedView={ this._opened() }
        widgetName='DatasetDetails'
        icon='glyphicon-list-alt'
      />
    );
  }

  renderLink(service, label) {
    if (service) {
      return <a target="_blank" href={ service.url }>{ label }</a>
    }
    else {
      return 'N/A';
    }
  }
}

export default DatasetDetails
