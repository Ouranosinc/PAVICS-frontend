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
    this.props.openWmsLayer(layer);
    this.props.fetchWMSLayerDetails(url, layer);
  }

  _onLoadWMSLayer (start, end, style, opacity) {
    let url = 'http://132.217.140.31:8080/ncWMS2/wms';
    let layer = this.props.currentOpenedWMSLayer;
    this.props.selectLoadWms(url, layer, start, end, opacity, style);
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
          {
            (this.props.currentOpenedWMSLayer.length)
              ? <DatasetWMSLayer onLoadWMSLayer={this._onLoadWMSLayer} />
              : null
          }
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
