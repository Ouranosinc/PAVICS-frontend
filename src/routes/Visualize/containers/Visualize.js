import React from 'react'
import { connect } from 'react-redux'
import classes from './Visualize.scss'
import SearchCatalog from '../../../containers/SearchCatalog'
import SearchCatalogResults from '../../../containers/SearchCatalogResults'

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
  requestDatasets,
  receiveDatasetsFailure,
  receiveDatasets,
  openDatasetDetails,
  closeDatasetDetails,
  //Async
  fetchFacets,
  fetchDatasets
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
          <div className={classes.searchCatalogComponent + " col-sm-5 col-md-4 col-lg-4"}>
            <div className={classes.overlappingBackground + " panel panel-default"}>
              <div className="panel-body">
                <SearchCatalog {...this.props }></SearchCatalog>
                <SearchCatalogResults {...this.props }></SearchCatalogResults>
              </div>
            </div>
          </div>
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
                <h1>The Map Background is coming soon...</h1>
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
  fetchDatasets,
  requestDatasets,
  receiveDatasetsFailure,
  receiveDatasets,
  openDatasetDetails,
  closeDatasetDetails,
  //Async
  fetchFacets,
  fetchDatasets
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
