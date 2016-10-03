import React from 'react'
import classes from './DatasetDetails.scss'
import Loader from '../../components/Loader'
import Table, {TableHeader, TableBody} from '../Table'
import Panel, {PanelHeader, ToggleButton} from '../Panel'
import * as constants from './../../routes/Visualize/constants'
export class DatasetDetails extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
    fetchDatasetWMSLayers: React.PropTypes.func.isRequired,
    openDatasetWmsLayers: React.PropTypes.func.isRequired,
    selectedDatasets: React.PropTypes.object.isRequired,
    panelControls: React.PropTypes.object.isRequired,
    currentOpenedDatasetWMSFile: React.PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this._onOpenDatasetWmsLayers = this._onOpenDatasetWmsLayers.bind(this)
    this._togglePanel = this._togglePanel.bind(this)
    this._mainComponent = this._mainComponent.bind(this)
  }

  /* _loadWmsDataset(url, name) {
   this.props.selectLoadWms(url, this.props.selectedDatasets.items[0].id, name)
   } */
  _onOpenDatasetWmsLayers (url, dataset) {
    this.props.openDatasetWmsLayers(dataset)
    this.props.fetchDatasetWMSLayers(url, dataset)
    this.props.clickTogglePanel(constants.PANEL_DATASET_DETAILS, false)
    this.props.clickTogglePanel(constants.PANEL_DATASET_WMS_LAYERS, true)
    /* this.props.selectLoadWms(url, this.props.selectedDatasets.items[0].id, dataset) */
  }

  _mainComponent () {
    let MainComponent
    if (this.props.selectedDatasets.isFetching) {
      MainComponent = <Loader name="dataset" />
    } else {
      if (this.props.selectedDatasets.items.length) {
        let rows = []
        let headers = [
          'Resource title',
          'Size',
          'OpenDAP',
          'HTTP',
          'WMS'
        ]
        let selectedIndex = -1
        this.props.selectedDatasets.items[0].datasets.map((row, i) => {
          if (row.name === this.props.currentOpenedDatasetWMSFile) {
            selectedIndex = i
          }
          rows[i] = [
            row.name,
            row.size.replace('bytes', ''),
            this.renderLink(row.services.find(row => row.type === 'OpenDAP'), 'View'),
            this.renderLink(row.services.find(row => row.type === 'HTTPServer'), 'Download'),
            (row.services.find(row => row.type === 'WMS'))
              ? <a href="#"
              onClick={() => this._onOpenDatasetWmsLayers(row.services.find(row => row.type === 'WMS').url, row.name)}>Open</a>
              : 'N/A'
          ]
        })
        MainComponent =
          <div>
            <div className={classes['DatasetMetadatas']}>
              {
                this.props.selectedDatasets.items[0].metadatas.map((x) =>
                  <div key={x.key + x.value}><strong>{x.key}: </strong>{x.value} </div>,
                )
              }
            </div>
            <Table>
              <TableHeader fields={headers} />
              <TableBody rows={rows} selectedIndex={selectedIndex} />
            </Table>
          </div>
      } else {
        MainComponent = <span className="NotAvailable">You must first search catalogs then select a dataset.</span>
      }
    }
    return MainComponent
  }

  _togglePanel () {
    let newState = !this.props.panelControls[constants.PANEL_DATASET_DETAILS].show
    this.props.clickTogglePanel(constants.PANEL_DATASET_DETAILS, newState)
  }

  render () {
    return (
      <Panel>
        <PanelHeader
          panelIsActive={this.props.panelControls[constants.PANEL_DATASET_DETAILS].show}
          onClick={this._togglePanel}
          icon="glyphicon-list-alt">Dataset Details
        </PanelHeader>
        {
          this.props.panelControls[constants.PANEL_DATASET_DETAILS].show
            ? this._mainComponent()
            : null
        }
      </Panel>
    )
  }

  renderLink (service, label) {
    if (service) {
      return <a target="_blank" href={service.url}>{label}</a>
    } else {
      return 'N/A'
    }
  }
}
export default DatasetDetails
