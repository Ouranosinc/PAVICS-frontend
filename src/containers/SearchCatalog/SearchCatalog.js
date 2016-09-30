import React from 'react'
import {connect} from 'react-redux'
import Panel, {ToggleButton, PanelHeader} from './../../components/Panel'
import FacetLabel from './../../components/FacetLabel'
import Loader from './../../components/Loader'
import SearchCatalogResults from './../../containers/SearchCatalogResults'
import CriteriaSelection from './../../components/CriteriaSelection'
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
    facets: React.PropTypes.object.isRequired,
    selectedFacets: React.PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.recommendedKeys = [
      "project",
      "model",
      "variable",
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
    this._onClosePanel = this._onClosePanel.bind(this);
    this._onOpenPanel = this._onOpenPanel.bind(this);
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

  // posterity
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

  _onClosePanel() {
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
      mainComponent = (
        this.props.facets.items.length === 0
          ?
          <div>No Facets (yet)</div>
          :
          <div>
            <div className="pure-g">
              <div className="pure-u-18-24">
                <PanelHeader onClick={this._onClosePanel} icon="glyphicon-search">Filter Catalogs by Facets</PanelHeader>
              </div>
              <div className="pure-u-6-24">
                <form className="pure-form">
                  <fieldset>
                    <label htmlFor="facetKey">Key:
                      <select id="facetKey"
                              value={ this.props.currentSelectedKey }
                              onChange={ this._onSelectedKey }>
                        {
                          this.props.facets.items.map((x, i) => {
                            return (this.recommendedKeys.includes(x.key))
                              ? null
                              : <option key={i + 1} value={x.key}>{x.key}</option>
                          })
                        }
                      </select>
                    </label>
                  </fieldset>
                </form>
              </div>
            </div>
            <div className="pure-g">
              {
                this.recommendedKeys.map((facetKey, i) => {
                  return <div className="pure-u-6-24" key={i}>
                    <CriteriaSelection
                      criteriaName={facetKey}
                      variables={this.props.facets.items.find((x) => {
                        return x.key === facetKey
                      })}
                      selectedFacets={this.props.selectedFacets}
                      addFacetKeyValue={this.props.addFacetKeyValue}
                      removeFacetKeyValue={this.props.removeFacetKeyValue}
                      fetchCatalogDatasets={this.props.fetchCatalogDatasets}/>
                  </div>
                })
              }
              {
                (this.props.currentSelectedKey.length > 0)
                  ?
                  <div className="pure-u-6-24">
                    <CriteriaSelection
                      criteriaName={this.props.currentSelectedKey}
                      variables={this.props.facets.items.find((x) => {
                        return x.key === this.props.currentSelectedKey
                      })}
                      selectedFacets={this.props.selectedFacets}
                      addFacetKeyValue={this.props.addFacetKeyValue}
                      removeFacetKeyValue={this.props.removeFacetKeyValue}
                      fetchCatalogDatasets={this.props.fetchCatalogDatasets}/>

                  </div>
                  : null
              }
            </div>
            <div className="pure-g">
              {
                this.recommendedKeys.map((facetKey, i) => {
                  return (this.props.selectedFacets.length)
                    ?
                    <div className="pure-u-6-24" key={i}>
                      <label>Facets:</label>
                      <div>
                        {
                          this.props.selectedFacets.map((x, i) =>
                            x.key === facetKey
                              ? <FacetLabel key={i + 1} facet={ x } onRemoveFacet={ this._onRemoveFacet }/>
                              : null
                          )
                        }
                      </div>
                    </div>
                    : null
                })
              }
              {
                (this.props.selectedFacets.length)
                  ?
                  <div className="pure-u-6-24">
                    <label>Facets:</label>
                    <div>
                      {
                        this.props.selectedFacets.map((x, i) =>
                          !this.recommendedKeys.includes(x.key)
                            ? <FacetLabel key={i + 1} facet={ x } onRemoveFacet={ this._onRemoveFacet }/>
                            : null
                        )
                      }
                    </div>
                  </div>
                  : null
              }
            </div>
          </div>
      );
    }
    return mainComponent;
  }

  render() {
    return (
      this.props.panelControls.SearchCatalog.show
        ?
        <Panel>
          {this._mainComponent()}
          <SearchCatalogResults {...this.props } />
        </Panel>
        : <Panel><ToggleButton icon="glyphicon-search" onClick={this._onOpenPanel}/></Panel>
    );
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
)(SearchCatalog)
