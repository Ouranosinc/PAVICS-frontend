import React from 'react'
import {connect} from 'react-redux'
import classes from './Visualize.scss'

//TODO: Fix, we should only import containers here
import OLComponent from '../../../components/OLComponent'
import DatasetDetails from '../../../components/DatasetDetails'

//Containers
import {DatasetWMSLayers, SearchCatalog, ClimateVariables} from '../../../containers'

import {
  //Panels
  clickTogglePanel,
  //Facets
  selectFacetKey,
  selectFacetValue,
  addFacetKeyValue,
  removeFacetKeyValue,
  requestFacets,
  receiveFacetsFailure,
  receiveFacets,
  //datasets
  requestDataset,
  receiveDatasetFailure,
  receiveDataset,
  requestCatalogDatasets,
  receiveCatalogDatasetsFailure,
  receiveCatalogDatasets,
  openDatasetDetails,
  closeDatasetDetails,
  openDatasetWmsLayers,
  openWmsLayer,
  selectLoadWms,
  //Async
  fetchFacets,
  fetchDataset,
  fetchCatalogDatasets,
  fetchDatasetWMSLayers,
  fetchWMSLayerDetails
} from '../modules/Visualize'

var me;

class Visualize extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    console.log(props);
    this.props.fetchFacets();
    this.lastKey = 0;
    this.lastValue = 0;
    me = this;
  }


  render() {
    return (
      <div className={classes['Visualize']}>
        <div className={classes.mapContainer}>
          <OLComponent {...this.props }/>
        </div>
        <div className={classes.left}>
          <div className={classes.panel}>
            <SearchCatalog {...this.props } />
          </div>
          <div className={classes.panel}>
            <ClimateVariables {...this.props}/>
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.panel}>
            <DatasetDetails {...this.props } />
          </div>
          <div className={classes.panel}>
            <DatasetWMSLayers {...this.props } />
          </div>
        </div>
      </div>
    )
  }
}

const mapActionCreators = {
  //Panels
  clickTogglePanel,
  //Facets
  selectFacetKey,
  selectFacetValue,
  addFacetKeyValue,
  removeFacetKeyValue,
  requestFacets,
  receiveFacetsFailure,
  receiveFacets,
  //Datasets
  requestDataset,
  receiveDatasetFailure,
  receiveDataset,
  requestCatalogDatasets,
  receiveCatalogDatasetsFailure,
  receiveCatalogDatasets,
  openDatasetDetails,
  closeDatasetDetails,
  openDatasetWmsLayers,
  openWmsLayer,
  selectLoadWms,
  //Async
  fetchFacets,
  fetchDataset,
  fetchCatalogDatasets,
  fetchDatasetWMSLayers,
  fetchWMSLayerDetails
};

const mapStateToProps = (state) => ({
  currentSelectedKey: state.visualize.currentSelectedKey,
  currentSelectedValue: state.visualize.currentSelectedValue,
  currentOpenedDataset: state.visualize.currentOpenedDataset,
  currentOpenedDatasetWMSFile: state.visualize.currentOpenedDatasetWMSFile,
  currentOpenedWMSLayer: state.visualize.currentOpenedWMSLayer,
  loadedWmsDatasets: state.visualize.loadedWmsDatasets,
  selectedFacets: state.visualize.selectedFacets,
  selectedDatasets: state.visualize.selectedDatasets,
  selectedWMSLayers: state.visualize.selectedWMSLayers,
  datasets: state.visualize.datasets,
  facets: state.visualize.facets,
  variables: state.visualize.variables,
  panelControls: state.visualize.panelControls
});

export default connect(mapStateToProps, mapActionCreators)(Visualize)
