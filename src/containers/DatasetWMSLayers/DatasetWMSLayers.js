import React from 'react'
import { connect } from 'react-redux'
import classes from './DatasetWMSLayers.scss'

import DatasetWMSLayersList from '../../components/DatasetWMSLayersList'
import DatasetWMSLayer from '../../components/DatasetWMSLayer'
import Loader from '../../components/Loader'
import ToggleButton from '../../components/ToggleButton'

export class DatasetWMSLayers extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired
  };


  constructor(props) {
    super(props);
    this._onCloseDatasetWMSLayersPanel = this._onCloseDatasetWMSLayersPanel.bind(this);
    this._onOpenDatasetWMSLayersPanel = this._onOpenDatasetWMSLayersPanel.bind(this);
    this._onSelectDatasetWMSLayer = this._onSelectDatasetWMSLayer.bind(this);
    this._onLoadWMSLayer = this._onLoadWMSLayer.bind(this);
  }

  _onCloseDatasetWMSLayersPanel(){
    this.props.clickTogglePanel("datasetWMSLayersPanel", false);
  }

  _onOpenDatasetWMSLayersPanel(){
    this.props.clickTogglePanel("datasetWMSLayersPanel", true);
  }

  _onSelectDatasetWMSLayer(url, layer){

    this.props.openWmsLayer(layer);
    this.props.fetchWMSLayerDetails(url, layer)
  }

  _onLoadWMSLayer(start, end, style, opacity){
    let url = "http://132.217.140.31:8080/ncWMS2/wms";
    let layer = this.props.currentOpenedWMSLayer;
    this.props.selectLoadWms(url, layer, start, end, opacity, style);
  }


  render () {
    if(this.props.panelControls.datasetWMSLayersPanel.show){
      let MainComponent = null;
      if(this.props.currentOpenedDatasetWMSFile.length){
        MainComponent =
          <div>
            <DatasetWMSLayersList
              isFetching={ this.props.selectedWMSLayers.isFetching }
              layers={ this.props.selectedWMSLayers.items }
              onSelectLayer={this._onSelectDatasetWMSLayer }
              currentLayer={this.props.currentOpenedWMSLayer} />
            {
              (this.props.currentOpenedWMSLayer.length) ?
                <DatasetWMSLayer
                  onLoadWMSLayer={this._onLoadWMSLayer}
                /> : null
            }
          </div>
      }else{
        MainComponent = <span className="NotAvailable">You must first select a dataset then "Open" chosen WMS file.</span>;
      }
      return (
        <div className={classes['DatasetWMSLayers']}>
          <div className={classes.datasetWMSLayersComponent}>
            <div className={classes.overlappingBackground + " panel panel-default"}>
              <h3><ToggleButton onClick={this._onCloseDatasetWMSLayersPanel} icon="glyphicon-globe"/> WMS Layers</h3>
              <div className="panel-body">
                { MainComponent }
              </div>
            </div>
          </div>
        </div>
      );
    }else{
      return(
        <div className={classes['DatasetWMSLayers']}>
          <div className={classes.datasetWMSLayersComponent}>
            <div className={classes.overlappingBackground + " " + classes.togglePanel + " panel panel-default"}>
              <ToggleButton onClick={this._onOpenDatasetWMSLayersPanel} icon="glyphicon-globe"/>
            </div>
          </div>
        </div>
      );
    }
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
