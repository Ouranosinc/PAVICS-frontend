import React from 'react'
import { connect } from 'react-redux'
import classes from './Visualize.scss'
import SearchCatalog from '../../../containers/SearchCatalog'

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
          <div className={classes.overlappingComponent + " col-sm-4 col-md-4 col-lg-4"}>
            <div className={classes.overlappingBackground + " panel panel-default"}>
              <div className="panel-body">
                <SearchCatalog {...this.props }></SearchCatalog>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-12">
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
  //Async
  fetchFacets,
  fetchDatasets
};

const mapStateToProps = (state) => ({
  currentSelectedKey: state.visualize.currentSelectedKey,
  currentSelectedValue: state.visualize.currentSelectedValue,
  selectedFacets: state.visualize.selectedFacets,
  selectedDatasets: state.visualize.selectedDatasets,
  datasets: state.visualize.datasets,
  facets: state.visualize.facets
});

export default connect(mapStateToProps, mapActionCreators)(Visualize)
