import React from 'react';
import Panel, {PanelHeader} from './../../components/Panel';
import DatasetWMSLayersList from '../../components/DatasetWMSLayersList';
import DatasetWMSLayer from '../../components/DatasetWMSLayer';
import * as constants from './../../constants';

export class DatasetWMSLayers extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
    openWmsLayer: React.PropTypes.func.isRequired,
    selectLoadWms: React.PropTypes.func.isRequired,
    fetchWMSLayerDetails: React.PropTypes.func.isRequired,
    panelControls: React.PropTypes.object.isRequired,
    selectedWMSLayers: React.PropTypes.object.isRequired,
    currentOpenedDatasetWMSFile: React.PropTypes.string.isRequired,
    currentOpenedWMSLayer: React.PropTypes.string.isRequired
  }

  constructor (props) {
    super(props);
    this._onSelectDatasetWMSLayer = this._onSelectDatasetWMSLayer.bind(this);
    this._onLoadWMSLayer = this._onLoadWMSLayer.bind(this);
    this._mainComponent = this._mainComponent.bind(this);
    this._togglePanel = this._togglePanel.bind(this);
  }

  _onSelectDatasetWMSLayer (url, layer) {
    // TODO: Déplacer cet appel bien plus haut dans le flow (sélection du dataset initial après la rechercher)
    // dataset  = this.props.selectedWMSLayers.items[0].dataset
    // wmsUrl  = this.props.selectedWMSLayers.items[0].wmsUrl
    //TODO: Add default(first) date info in this.props.selectedWMSLayers
    // date = this.props.selectedWMSLayers.nearestTimeIso
    this.props.openWmsLayer(layer);
    this.props.fetchWMSLayerDetails(url, layer);

    // let date = this.props.selectedWMSLayerDetails.data.nearestTimeIso;
    // let date = "1966-01-01T00:00:00.000Z";
    let date = "1995-12-07T12:00:00.000Z";

    this.props.fetchWMSLayerTimesteps(url, layer, date);
    this.props.setCurrentDateTime(date);
    this.props.selectLoadWms(url, layer, date, '', 'default-scalar/div-RdYlBu', 0.4);
  }

  _onLoadWMSLayer (start, end, style, opacity) {
    let url = 'http://outarde.crim.ca:8084/ncWMS2/wms'; // 'http://132.217.140.31:8080/ncWMS2/wms';
    let layer = this.props.currentOpenedWMSLayer;
    this.props.selectLoadWms(url, layer, start, end, style, opacity);
  }

  _mainComponent () {
    let MainComponent = null;
    if (this.props.currentOpenedDatasetWMSFile.length) {
      MainComponent =
        <div>
          <DatasetWMSLayersList
            isFetching={this.props.selectedWMSLayers.isFetching}
            layers={this.props.selectedWMSLayers.items}
            onSelectLayer={this._onSelectDatasetWMSLayer}
            currentLayer={this.props.currentOpenedWMSLayer} />
          { /*
            (this.props.currentOpenedWMSLayer.length)
              ? <DatasetWMSLayer setCurrentDateTime={this.props.setCurrentDateTime}
                                 selectedWMSLayerDetails={this.props.selectedWMSLayerDetails}
                                 onLoadWMSLayer={this._onLoadWMSLayer} />
              : null
          */}
        </div>;
    } else {
      MainComponent =
        <span className="NotAvailable">You must first select a dataset then "Open" chosen WMS file.</span>;
    }
    return MainComponent;
  }

  _togglePanel () {
    let newState = !this.props.panelControls[constants.PANEL_DATASET_WMS_LAYERS].show;
    this.props.clickTogglePanel(constants.PANEL_DATASET_WMS_LAYERS, newState);
  }

  render () {
    return (
      <Panel>
        <PanelHeader
          panelIsActive={this.props.panelControls[constants.PANEL_DATASET_WMS_LAYERS].show}
          onClick={this._togglePanel}
          icon="glyphicon-globe">
          WMS Layers
        </PanelHeader>
        {
          this.props.panelControls[constants.PANEL_DATASET_WMS_LAYERS].show
            ? this._mainComponent()
            : null
        }
      </Panel>
    );
  }
}
export default DatasetWMSLayers;
