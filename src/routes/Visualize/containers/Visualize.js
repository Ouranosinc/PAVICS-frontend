import React from 'react'
import {connect} from 'react-redux'
import classes from './Visualize.scss'

//TODO: Fix, we should only import containers here
import OLComponent from '../../../components/OLComponent'
import DatasetDetails from '../../../components/DatasetDetails'

//Containers
import DatasetWMSLayers from '../../../containers/DatasetWMSLayers'
import SearchCatalog from '../../../containers/SearchCatalog'

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
          <SearchCatalog {...this.props } />
        </div>
        <div className={classes.right}>
          <DatasetDetails {...this.props } />
          <DatasetWMSLayers {...this.props } />
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
  panelControls: state.visualize.panelControls
});

export default connect(mapStateToProps, mapActionCreators)(Visualize)
