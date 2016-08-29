import React from 'react'
import { connect } from 'react-redux'
import classes from './DatasetWMSLayers.scss'

import DatasetWMSLayersList from '../../components/DatasetWMSLayersList'
import DatasetWMSLayersPicker from '../../components/DatasetWMSLayersPicker'
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
  }

  _onCloseDatasetWMSLayersPanel(){
    this.props.clickTogglePanel("datasetWMSLayersPanel", false);
  }

  _onOpenDatasetWMSLayersPanel(){
    this.props.clickTogglePanel("datasetWMSLayersPanel", true);
  }


  render () {
    if(this.props.panelControls.datasetWMSLayersPanel.show){
      return (
        <div className={classes['DatasetWMSLayers']}>
          <div className={classes.datasetWMSLayersComponent}>
            <div className={classes.overlappingBackground + " panel panel-default"}>
              <h3><ToggleButton onClick={this._onCloseDatasetWMSLayersPanel} icon="glyphicon-globe"/> WMS Layers</h3>
              <div className="panel-body">
                <DatasetWMSLayersList />
                <DatasetWMSLayersPicker></DatasetWMSLayersPicker>
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
