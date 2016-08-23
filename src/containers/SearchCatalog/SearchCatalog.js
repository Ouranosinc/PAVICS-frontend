import React from 'react'
import { connect } from 'react-redux'
import classes from './SearchCatalog.scss'

import FacetLabel from '../../components/FacetLabel'
import Loader from '../../components/Loader'

export class SearchCatalog extends React.Component {
  static propTypes = {
    /* Helps Webstorm to auto-complete function calls and enforce React Props Validation*/
    selectFacetKey: React.PropTypes.func.isRequired,
    selectFacetValue: React.PropTypes.func.isRequired,
    addFacetKeyValue: React.PropTypes.func.isRequired,
    removeFacetKeyValue: React.PropTypes.func.isRequired,
    requestFacets: React.PropTypes.func.isRequired,
    receiveFacetsFailure: React.PropTypes.func.isRequired,
    receiveFacets: React.PropTypes.func.isRequired,
    requestCatalogDatasets: React.PropTypes.func.isRequired,
    receiveCatalogDatasetsFailure: React.PropTypes.func.isRequired,
    receiveCatalogDatasets: React.PropTypes.func.isRequired,
    fetchFacets: React.PropTypes.func.isRequired,
    fetchDataset: React.PropTypes.func.isRequired,
    fetchCatalogDatasets: React.PropTypes.func.isRequired,
    datasets: React.PropTypes.object.isRequired,
    facets: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.currentSelectedKey = "";
    this.currentSelectedValue = "";
    this.currentFacetValues = [];
    this.props.fetchFacets();
    //This way we can remove "me" from component and always use "this", but it must be done for all components methods with callbacks...
    this._onAddFacet = this._onAddFacet.bind(this);
    this._onRemoveFacet = this._onRemoveFacet.bind(this);
    this._onSelectedKey = this._onSelectedKey.bind(this);
    this._onSelectedValue = this._onSelectedValue.bind(this);
    this._onSearchCatalog = this._onSearchCatalog.bind(this);
  }

  _onAddFacet(event){
    if(this.props.currentSelectedKey.length && this.props.currentSelectedValue.length){
      this.props.addFacetKeyValue(this.props.currentSelectedKey, this.props.currentSelectedValue);
      this.props.selectFacetKey("");
      //TODO: Auto-fetch on onAddFacet() ?
      this.props.fetchCatalogDatasets();
    }
  }

  _onRemoveFacet(key, value){
    this.props.removeFacetKeyValue(key, value);
    //TODO: Auto-fetch on onRemoveFacet() ?
    this.props.fetchCatalogDatasets();
  }

  _onSelectedKey(event){
    this.props.selectFacetKey(event.target.value);
    let facet = this.props.facets.items.find( x => x.key === event.target.value);
    if(facet){
      this.currentFacetValues = facet.values;
    }else{
      this.currentFacetValues = [];
    }
  }

  _onSelectedValue(event){
    this.props.selectFacetValue(event.target.value);
  }

  _onSearchCatalog(event){
    this.props.fetchCatalogDatasets();
  }

  render () {
    //console.log("render SearchCatalog");
    let mainComponent;
    if(this.props.facets.isFetching){
      mainComponent = <Loader name="facets" />
    }else{
      mainComponent = <div className="form-group">
        <form className="form-horizontal" role="form">
          <div className="form-group">
            <label className="col-sm-4 col-md-3 col-lg-3 control-label" htmlFor="facetKey">Key:</label>
            <div className="col-sm-8 col-md-9 col-lg-9">
              <select id="facetKey" className="form-control" value={ this.props.currentSelectedKey } onChange={ this._onSelectedKey }>
                <option value="">-- Select a key --</option>
                {this.props.facets.items.map((x, i) =>
                  <option key={i + 1} value={ x.key }>{ x.key }</option>
                )}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-4 col-md-3 col-lg-3 control-label" htmlFor="facetValue">Value:</label>
            <div className="col-sm-8 col-md-9 col-lg-9">
              <select id="facetValue" className="form-control" value={ this.props.currentSelectedValue } onChange={ this._onSelectedValue } disabled={!this.props.currentSelectedKey.length}>
                <option value="">-- Select a value --</option>
                {this.currentFacetValues.map((x, i) =>
                  <option key={i + 1} value={ x }>{ x }</option>
                )}
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-4 col-md-offset-3 col-lg-offset-3 col-sm-2 col-md-2 col-lg-2">
              <a type="button" className="btn btn-sm btn-default" title="Add" onClick={ this._onAddFacet } disabled={!this.props.currentSelectedKey.length || !this.props.currentSelectedValue.length}>
                <i className="glyphicon glyphicon-plus"></i> Facets
              </a>
            </div>
          </div>
          {
            (this.props.selectedFacets.length)
              ? <div className="form-group">
                  <label className="col-sm-4 col-md-3 col-lg-3 control-label">Facets:</label>
                  <div className="col-sm-8 col-md-9 col-lg-9">
                    {this.props.selectedFacets.map((x, i) =>
                      <FacetLabel key={i + 1} facet={ x } onRemoveFacet={ this._onRemoveFacet }/>
                    )}
                  </div>
                </div>
              : null
          }
          {/*<div className="form-group">
           <div className="col-sm-offset-4 col-md-offset-3 col-lg-offset-3 col-sm-3 col-md-3 col-lg-3">
           <a type="button" className="btn btn-sm btn-default" title="Search" onClick={ this._onSearchCatalog }>
           <i className="glyphicon glyphicon-search"></i> Search datasets
           </a>
           </div>
           </div>*/}
        </form>
      </div>
    }
    return (
      <div className={classes['SearchCatalog']}>
        <h3>Filter Catalogs by facets</h3>
        { mainComponent }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}
const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchCatalog)
