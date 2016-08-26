import React from 'react'
import { connect } from 'react-redux'
import classes from './Visualize.scss'
import OLComponent from '../../../components/OLComponent'
import SearchCatalog from '../../../containers/SearchCatalog'
import SearchCatalogResults from '../../../containers/SearchCatalogResults'
import DatasetDetails from '../../../components/DatasetDetails'
import ToggleButton from '../../../components/ToggleButton'

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
        <div className="row">
          <SearchCatalog {...this.props } />
          <DatasetDetails {...this.props } />
          {/*<div className={classes.searchCatalogResultsComponent + " col-sm-5 col-md-5 col-lg-5"}>
            <div className={classes.overlappingBackground + " panel panel-default"}>
              <div className="panel-body">

              </div>
            </div>
          </div>*/}
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
  loadedWmsDatasets: state.visualize.loadedWmsDatasets,
  selectedFacets: state.visualize.selectedFacets,
  selectedDatasets: state.visualize.selectedDatasets,
  datasets: state.visualize.datasets,
  facets: state.visualize.facets,
  panelControls: state.visualize.panelControls
});

export default connect(mapStateToProps, mapActionCreators)(Visualize)
