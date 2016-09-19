import React from 'react'
import {connect} from 'react-redux'
import classes from './SearchCatalog.scss'
import TogglingPanel, {OpenedPanel} from '../../components/TogglingPanel'
import FacetLabel from '../../components/FacetLabel'
import Loader from '../../components/Loader'
import SearchCatalogResults from '../../containers/SearchCatalogResults'
export class SearchCatalog extends React.Component {
  static propTypes = {
    /* Helps Webstorm to auto-complete function calls and enforce React Props Validation*/
    clickTogglePanel: React.PropTypes.func.isRequired,
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
    this.recommendedKeys = [
      "ensemble",
      "experiment",
      "institute",
      "model",
      "project",
      "time_frequency",
      "variable"
    ];
    this.currentSelectedKey = "";
    this.currentSelectedValue = "";
    this.currentFacetValues = [];
    //This way we can remove "me" from component and always use "this", but it must be done for all components methods with callbacks...
    this._onAddFacet = this._onAddFacet.bind(this);
    this._onRemoveFacet = this._onRemoveFacet.bind(this);
    this._onSelectedKey = this._onSelectedKey.bind(this);
    this._onSelectedValue = this._onSelectedValue.bind(this);
    this._onSearchCatalog = this._onSearchCatalog.bind(this);
    this._onCloseSearchCatalogPanel = this._onCloseSearchCatalogPanel.bind(this);
    this._onOpenPanel = this._onOpenPanel.bind(this);
    this._opened = this._opened.bind(this);
    this._makePanelContent = this._makePanelContent.bind(this);
  }

  _onAddFacet(event) {
    if (this.props.currentSelectedKey.length && this.props.currentSelectedValue.length) {
      this.props.addFacetKeyValue(this.props.currentSelectedKey, this.props.currentSelectedValue);
      this.props.selectFacetKey("");
      //TODO: Auto-fetch on onAddFacet() ?
      this.props.fetchCatalogDatasets();
    }
  }

  _onRemoveFacet(key, value) {
    this.props.removeFacetKeyValue(key, value);
    //TODO: Auto-fetch on onRemoveFacet() ?
    this.props.fetchCatalogDatasets();
  }

  _onSelectedKey(event) {
    this.props.selectFacetKey(event.target.value);
    let facet = this.props.facets.items.find(x => x.key === event.target.value);
    if (facet) {
      this.currentFacetValues = facet.values;
    } else {
      this.currentFacetValues = [];
    }
  }

  _onSelectedValue(event) {
    this.props.selectFacetValue(event.target.value);
  }

  _onSearchCatalog(event) {
    this.props.fetchCatalogDatasets();
  }

  _onCloseSearchCatalogPanel() {
    this.props.clickTogglePanel("SearchCatalog", false);
  }

  _onOpenPanel() {
    this.props.clickTogglePanel("SearchCatalog", true);
  }

  _mainComponent() {
    let mainComponent;
    if (this.props.facets.isFetching) {
      mainComponent = <Loader name="facets"/>
    } else {
      mainComponent = <div className="form-group">
        <form className="form-horizontal" role="form">
          <div className="form-group">
            <label className="col-sm-4 col-md-3 col-lg-3 control-label" htmlFor="facetKey">Key:</label>
            <div className="col-sm-8 col-md-9 col-lg-9">
              <select id="facetKey" className="form-control" value={ this.props.currentSelectedKey }
                      onChange={ this._onSelectedKey }>
                <option value="">-- Select a key --</option>
                <optgroup label="Recommended">
                  {this.recommendedKeys.map((x, i) =>
                    <option key={i + 1} value={ x }>{ x }</option>
                  )}
                </optgroup>
                <optgroup label="Others">
                  {this.props.facets.items.map((x, i) =>
                    (this.recommendedKeys.includes(x.key)) ? null :
                      <option key={i + 1} value={ x.key }>{ x.key }</option>
                  )}
                </optgroup>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-4 col-md-3 col-lg-3 control-label" htmlFor="facetValue">Value:</label>
            <div className="col-sm-8 col-md-9 col-lg-9">
              <select id="facetValue" className="form-control" value={ this.props.currentSelectedValue }
                      onChange={ this._onSelectedValue } disabled={!this.props.currentSelectedKey.length}>
                <option value="">-- Select a value --</option>
                {this.currentFacetValues.map((x, i) =>
                  <option key={i + 1} value={ x }>{ x }</option>
                )}
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-4 col-md-offset-3 col-lg-offset-3 col-sm-2 col-md-2 col-lg-2">
              <a type="button" className="btn btn-sm btn-default" title="Add" onClick={ this._onAddFacet }
                 disabled={!this.props.currentSelectedKey.length || !this.props.currentSelectedValue.length}>
                <i className="glyphicon glyphicon-plus"/> Facets
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
        </form>
      </div>
    }
    return mainComponent;
  }

  _makePanelContent() {
    return (
      <div>
        {this._mainComponent()}
        <SearchCatalogResults {...this.props } />
      </div>
    );
  }

  _opened() {
    return (
      <OpenedPanel
        onClosePanelCb={this._onCloseSearchCatalogPanel}
        icon='glyphicon-search'
        panelTitle='Filter Catalogs by Facets'
        panelContentCb={this._makePanelContent}/>
    );
  }

  render() {
    return (
      <TogglingPanel
        onOpenPanelCb={this._onOpenPanel}
        icon='glyphicon-search'
        classes={classes}
        active={this.props.panelControls.SearchCatalog.show}
        makeOpenedViewCb={this._opened}
        widgetName='SearchCatalog'
      />
    );
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
