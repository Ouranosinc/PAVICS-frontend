import React from 'react';
import {connect} from 'react-redux';
import Panel, {ToggleButton, PanelHeader} from './../../components/Panel';
import FacetLabel from './../../components/FacetLabel';
import Loader from './../../components/Loader';
import SearchCatalogResults from './../../containers/SearchCatalogResults';
import CriteriaSelection from './../../components/CriteriaSelection';
import * as constants from './../../constants';
// import {MenuItem, DropdownButton} from 'react-bootstrap';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';

export class SearchCatalog extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
    selectFacetKey: React.PropTypes.func.isRequired,
    selectFacetValue: React.PropTypes.func.isRequired,
    addFacetKeyValue: React.PropTypes.func.isRequired,
    removeFacetKeyValue: React.PropTypes.func.isRequired,
    requestFacets: React.PropTypes.func.isRequired,
    receiveFacetsFailure: React.PropTypes.func.isRequired,
    receiveFacets: React.PropTypes.func.isRequired,
    requestEsgfDatasets: React.PropTypes.func.isRequired,
    receiveEsgfDatasetsFailure: React.PropTypes.func.isRequired,
    receiveEsgfDatasets: React.PropTypes.func.isRequired,
    requestPavicsDatasets: React.PropTypes.func.isRequired,
    receivePavicsDatasetsFailure: React.PropTypes.func.isRequired,
    receivePavicsDatasets: React.PropTypes.func.isRequired,
    fetchFacets: React.PropTypes.func.isRequired,
    fetchDataset: React.PropTypes.func.isRequired,
    fetchEsgfDatasets: React.PropTypes.func.isRequired,
    fetchPavicsDatasets: React.PropTypes.func.isRequired,
    esgfDatasets: React.PropTypes.object.isRequired,
    pavicsDatasets: React.PropTypes.object.isRequired,
    facets: React.PropTypes.object.isRequired,
    selectedFacets: React.PropTypes.array.isRequired,
    currentSelectedKey: React.PropTypes.string.isRequired,
    currentSelectedValue: React.PropTypes.string.isRequired,
    panelControls: React.PropTypes.object.isRequired
  };

  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleNestedListToggle = (item) => {
    this.setState({
      open: item.state.open
    });
  };

  constructor (props) {
    super(props);
    this.recommendedKeys = [
      'project',
      'model',
      'variable'
    ];
    this.currentSelectedKey = '';
    this.currentSelectedValue = '';
    this.currentFacetValues = [];
    // this._onAddFacet = this._onAddFacet.bind(this);
    this._onRemoveFacet = this._onRemoveFacet.bind(this);
    this._onSelectedKey = this._onSelectedKey.bind(this);
    // this._onSelectedValue = this._onSelectedValue.bind(this);
    // this._onSearchCatalog = this._onSearchCatalog.bind(this);
    this._onOpenPanel = this._onOpenPanel.bind(this);
    this._togglePanel = this._togglePanel.bind(this);
  }

  // _onAddFacet (event) {
  //   if (this.props.currentSelectedKey.length && this.props.currentSelectedValue.length) {
  //     this.props.addFacetKeyValue(this.props.currentSelectedKey, this.props.currentSelectedValue);
  //     this.props.selectFacetKey('');
  //     // TODO: Auto-fetch on onAddFacet() ?
  //     this.props.fetchEsgfDatasets();
  //   }
  // }

  _onRemoveFacet (key, value) {
    this.props.removeFacetKeyValue(key, value);
    // TODO: Auto-fetch on onRemoveFacet() ?
    this.props.fetchEsgfDatasets();
  }

  // posterity
  _onSelectedKey (eventKey) {
    this.props.selectFacetKey(eventKey);
    let facet = this.props.facets.items.find(x => x.key === eventKey);
    if (facet) {
      this.currentFacetValues = facet.values;
    } else {
      this.currentFacetValues = [];
    }
  }

  // _onSelectedValue (event) {
  //   this.props.selectFacetValue(event.target.value);
  // }

  // _onSearchCatalog (event) {
  //   this.props.fetchEsgfDatasets();
  // }

  _handleRequestDelete() {
    alert('You clicked the delete button.');
  }

  _onOpenPanel () {
    this.props.clickTogglePanel(constants.PANEL_SEARCH_CATALOG, true);
  }

  _togglePanel () {
    let newState = !this.props.panelControls[constants.PANEL_SEARCH_CATALOG].show;
    this.props.clickTogglePanel(constants.PANEL_SEARCH_CATALOG, newState);
  }

  _mainComponent () {
    let mainComponent;
    if (this.props.facets.isFetching) {
      mainComponent = <Loader name="facets" />;
    } else {
      mainComponent = (
        this.props.facets.items.length === 0
          ? <div>No Facets (yet)</div>
          : (
          <div className="container">
            <List style={{width: '50%'}}>
              <ListItem
                nestedListStyle={{
                  position: 'absolute', zIndex: '9999', width: '300px', maxHeight: '150px', overflowY: 'scroll', opacity: '1',
                  background: 'white', transform: 'scaleY(1)', transformOrigin: 'left top 0px',
                  transition: 'transform 500ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 500ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                  boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
                  borderRadius: '2px'}}
                primaryText="Model"
                leftIcon={<ContentInbox />}
                initiallyOpen={true}
                primaryTogglesNestedList={true}
                nestedItems={[
                  <ListItem
                    key={1}
                    primaryText="Starred"
                    leftCheckbox={<Checkbox />}
                  />,
                  <ListItem
                    key={2}
                    primaryText="Sent Mail"
                    leftCheckbox={<Checkbox />}
                  />,
                  <ListItem
                    key={3}
                    primaryText="Inbox"
                    leftCheckbox={<Checkbox />}
                  />
                ]}
              />
            </List>
            <Chip
              onRequestDelete={this._handleRequestDelete}
              style={{width: '50%'}}
              labelStyle={{width: '95%'}}>
              Model XyZ
            </Chip>
            <Chip
              onRequestDelete={this._handleRequestDelete}>
              Model XyZ fdf  fds fsd  fds
            </Chip>
            <Chip
              onRequestDelete={this._handleRequestDelete}>
              Model XyZ fdsf
            </Chip>
            <IconMenu
              iconButtonElement={
                <IconButton touch={true}>
                  <NavigationExpandMoreIcon />
                </IconButton>
              }
              multiple
              value={[1,2,3,4,5]}
              listStyle={{ width: '350px' }}>
              <MenuItem value="1" leftIcon={null} leftCheckbox={<Checkbox />} primaryText="Download" />
              <MenuItem value="2" checked primaryText="More Info" />
              <MenuItem value="3" checked primaryText="More Info" />
              <MenuItem value="4" checked primaryText="More Info" />
              <MenuItem value="5" checked primaryText="More Info" />
            </IconMenu>
            <div className="row">
              <div className="col-md-9">
                <PanelHeader
                  panelIsActive={this.props.panelControls[constants.PANEL_SEARCH_CATALOG].show}
                  onClick={this._togglePanel}
                  icon="glyphicon-search">
                  Filter Catalogs by Facets
                </PanelHeader>
              </div>
              <div className="col-md-3">
                {/*<DropdownButton title="Choose a facet" id="facetKey">
                  {
                    this.props.facets.items.map((x, i) => {
                      return (this.recommendedKeys.includes(x.key))
                        ? null
                        : <MenuItem key={i} eventKey={x.key} onSelect={this._onSelectedKey}>{x.key}</MenuItem>;
                    })
                  }
                </DropdownButton>*/}
              </div>
            </div>
            <div className="row">
              {
                this.recommendedKeys.map((facetKey, i) => {
                  return <div className="col-md-3" key={i}>
                    <CriteriaSelection
                      criteriaName={facetKey}
                      variables={this.props.facets.items.find((x) => {
                        return x.key === facetKey;
                      })}
                      selectedFacets={this.props.selectedFacets}
                      addFacetKeyValue={this.props.addFacetKeyValue}
                      removeFacetKeyValue={this.props.removeFacetKeyValue}
                      fetchPavicsDatasets={this.props.fetchPavicsDatasets}
                      fetchEsgfDatasets={this.props.fetchEsgfDatasets} />
                  </div>;
                })
              }
              {
                (this.props.currentSelectedKey.length > 0)
                  ? (
                  <div className="col-md-3">
                    <CriteriaSelection
                      criteriaName={this.props.currentSelectedKey}
                      variables={this.props.facets.items.find((x) => {
                        return x.key === this.props.currentSelectedKey;
                      })}
                      selectedFacets={this.props.selectedFacets}
                      addFacetKeyValue={this.props.addFacetKeyValue}
                      removeFacetKeyValue={this.props.removeFacetKeyValue}
                      fetchPavicsDatasets={this.props.fetchPavicsDatasets}
                      fetchEsgfDatasets={this.props.fetchEsgfDatasets} />
                  </div>
                )
                  : null
              }
            </div>
            <div className="row">
              {
                this.recommendedKeys.map((facetKey, i) => {
                  return (this.props.selectedFacets.length)
                    ? (
                    <div className="col-md-3" key={i}>
                      <label>Facets:</label>
                      <div>
                        {
                          this.props.selectedFacets.map((x, i) =>
                            x.key === facetKey
                              ? <FacetLabel key={i + 1} facet={x} onRemoveFacet={this._onRemoveFacet} />
                              : null
                          )
                        }
                      </div>
                    </div>
                  )
                    : null;
                })
              }
              {
                this.props.selectedFacets.length
                  ? (
                  <div className="col-md-3">
                    <label>Facets:</label>
                    <div>
                      {
                        this.props.selectedFacets.map((x, i) =>
                          !this.recommendedKeys.includes(x.key)
                            ? <FacetLabel key={i + 1} facet={x} onRemoveFacet={this._onRemoveFacet} />
                            : null
                        )
                      }
                    </div>
                  </div>
                )
                  : null
              }
            </div>
          </div>
        )
      );
    }
    return mainComponent;
  }

  render () {
    return (
      this.props.panelControls[constants.PANEL_SEARCH_CATALOG].show
        ? (
        <Paper style={{ margin: 20 }} zDepth={2}>
          {this._mainComponent()}
          <SearchCatalogResults {...this.props} />
        </Paper>
      )
        : <Panel><ToggleButton icon="glyphicon-search" onClick={this._onOpenPanel} /></Panel>
    );
  }
}
export default SearchCatalog;
