import React from 'react'
import {connect} from 'react-redux'
import Panel, {ToggleButton, PanelHeader} from './../../components/Panel'
import DatasetWMSLayersList from '../../components/DatasetWMSLayersList'
import DatasetWMSLayer from '../../components/DatasetWMSLayer'
import * as constants from './../../routes/Visualize/constants'
export class DatasetWMSLayers extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this._onClosePanel = this._onClosePanel.bind(this);
    this._onSelectDatasetWMSLayer = this._onSelectDatasetWMSLayer.bind(this);
    this._onLoadWMSLayer = this._onLoadWMSLayer.bind(this);
    this._onOpenPanel = this._onOpenPanel.bind(this);
    this._mainComponent = this._mainComponent.bind(this);
  }

  _onClosePanel() {
    this.props.clickTogglePanel(constants.PANEL_DATASET_WMS_LAYERS, false);
  }

  _onOpenPanel() {
    this.props.clickTogglePanel(constants.PANEL_DATASET_WMS_LAYERS, true);
  }

  _onSelectDatasetWMSLayer(url, layer) {
    this.props.openWmsLayer(layer);
    this.props.fetchWMSLayerDetails(url, layer)
  }

  _onLoadWMSLayer(start, end, style, opacity) {
    let url = "http://132.217.140.31:8080/ncWMS2/wms";
    let layer = this.props.currentOpenedWMSLayer;
    this.props.selectLoadWms(url, layer, start, end, opacity, style);
  }

  _mainComponent() {
    let MainComponent = null;
    if (this.props.currentOpenedDatasetWMSFile.length) {
      MainComponent =
        <div>
          <DatasetWMSLayersList
            isFetching={ this.props.selectedWMSLayers.isFetching }
            layers={ this.props.selectedWMSLayers.items }
            onSelectLayer={this._onSelectDatasetWMSLayer }
            currentLayer={this.props.currentOpenedWMSLayer}/>
          {
            (this.props.currentOpenedWMSLayer.length) ?
              <DatasetWMSLayer
                onLoadWMSLayer={this._onLoadWMSLayer}
              /> : null
          }
        </div>
    } else {
      MainComponent =
        <span className="NotAvailable">You must first select a dataset then "Open" chosen WMS file.</span>;
    }
    return MainComponent;
  }

  render() {
    return (
      this.props.panelControls[constants.PANEL_DATASET_WMS_LAYERS].show
        ?
        <Panel>
          <PanelHeader onClick={this._onClosePanel} icon="glyphicon-globe">WMS Layers</PanelHeader>
          {this._mainComponent()}
        </Panel>
        : <Panel><ToggleButton icon="glyphicon-globe" onClick={this._onOpenPanel}/></Panel>
    );
  }
}
const mapStateToProps = (state) => {
  return {}
};
const mapDispatchToProps = (dispatch) => {
  return {}
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetWMSLayers)
