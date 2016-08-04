import React from 'react'
import { connect } from 'react-redux'
import classes from './Visualize.scss'
import OLComponent from '../../../components/OLComponent'
import SearchCatalog from '../../../containers/SearchCatalog'
import SearchCatalogResults from '../../../containers/SearchCatalogResults'
import DatasetDetails from '../../../components/DatasetDetails'

import {
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
  //Async
  fetchFacets,
  fetchDataset,
  fetchCatalogDatasets
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
          <div className={classes.searchCatalogComponent + " col-sm-6 col-md-5 col-lg-4"}>
            <div className={classes.overlappingBackground + " panel panel-default"}>
              <div className="panel-body">
                <SearchCatalog {...this.props }></SearchCatalog>
                <SearchCatalogResults {...this.props }></SearchCatalogResults>
              </div>
            </div>
          </div>
          {
            (this.props.selectedDatasets.receivedAt) ?
              <div className={classes.datasetDetailsComponent + " col-sm-5 col-md-6 col-lg-6"}>
                <div className={classes.overlappingBackground + " panel panel-default"}>
                  <div className="panel-body">
                    <DatasetDetails {...this.props }></DatasetDetails>
                  </div>
                </div>
              </div> :
              null
          }
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
                <OLComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapActionCreators = {
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
  //Async
  fetchFacets,
  fetchDataset,
  fetchCatalogDatasets
};

const mapStateToProps = (state) => ({
  currentSelectedKey: state.visualize.currentSelectedKey,
  currentSelectedValue: state.visualize.currentSelectedValue,
  currentOpenedDataset: state.visualize.currentOpenedDataset,
  selectedFacets: state.visualize.selectedFacets,
  selectedDatasets: state.visualize.selectedDatasets,
  datasets: state.visualize.datasets,
  facets: state.visualize.facets
});

export default connect(mapStateToProps, mapActionCreators)(Visualize)
