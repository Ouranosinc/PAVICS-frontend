import React from 'react'
import { connect } from 'react-redux'
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
  selectLoadWms,
  //Async
  fetchFacets,
  fetchDataset,
  fetchCatalogDatasets,
  fetchDatasetWMSLayers
} from '../modules/Visualize'

var me;

class Visualize extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
    console.log(props);
    this.props.fetchFacets();
    this.lastKey = 0;
    this.lastValue = 0;
    me = this;
  }

  render () {
    return (
      <div className={classes['Visualize']}>
        <div className={classes.frontComponents + " row"}>
          <div className={classes.topLeftComponents + " col-sm-6 col-md-5 col-lg-4"}>
            <SearchCatalog {...this.props } />
          </div>
          <div className={classes.topRightComponents + " col-sm-5 col-md-6 col-lg-6"}>
            <div className="row">
                <DatasetDetails {...this.props } />
            </div>
            <div className="row">
                <DatasetWMSLayers {...this.props } />
            </div>
          </div>
        </div>
        <div className="row">
          <div className={classes.backgroundComponent + " col-md-12 col-lg-12"}>
            <div className="panel panel-default">
              <div className="panel-body">
                <OLComponent {...this.props }/>
              </div>
            </div>
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
  selectLoadWms,
  //Async
  fetchFacets,
  fetchDataset,
  fetchCatalogDatasets,
  fetchDatasetWMSLayers
};

const mapStateToProps = (state) => ({
  currentSelectedKey: state.visualize.currentSelectedKey,
  currentSelectedValue: state.visualize.currentSelectedValue,
  currentOpenedDataset: state.visualize.currentOpenedDataset,
  currentOpenedDatasetWMSFile: state.visualize.currentOpenedDatasetWMSFile,
  currentOpenWMSLayer: state.visualize.currentOpenWMSLayer,
  loadedWmsDatasets: state.visualize.loadedWmsDatasets,
  selectedFacets: state.visualize.selectedFacets,
  selectedDatasets: state.visualize.selectedDatasets,
  datasets: state.visualize.datasets,
  facets: state.visualize.facets,
  panelControls: state.visualize.panelControls
});

export default connect(mapStateToProps, mapActionCreators)(Visualize)
