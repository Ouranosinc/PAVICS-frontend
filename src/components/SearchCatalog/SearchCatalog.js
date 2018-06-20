import React from 'react';
import PropTypes from 'prop-types';
import Loader from './../../components/Loader';
import { NotificationManager } from 'react-notifications';
import SearchCatalogResults from './../../components/SearchCatalogResults';
import CriteriaSelection from './../../components/CriteriaSelection';
import Select from'@material-ui/core/Select';
import MenuItem from'@material-ui/core/MenuItem';
import Paper from'@material-ui/core/Paper';
import { Row, Col } from 'react-bootstrap';
import ListSubheader from'@material-ui/core/ListSubheader';
import List from'@material-ui/core/List';
import Button from'@material-ui/core/Button';
import TextField from'@material-ui/core/TextField';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

export class SearchCatalog extends React.Component {
  static propTypes = {
    currentProjectSearchCriterias: PropTypes.array.isRequired,
    clickTogglePanel: PropTypes.func.isRequired,
    addSearchCriteriasToProject: PropTypes.func.isRequired,
    addDatasetsToProject: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    projectActions: PropTypes.object.isRequired,
    projectAPI: PropTypes.object.isRequired,
    projectAPIActions: PropTypes.object.isRequired,
    sessionManagement: PropTypes.object.isRequired,
    research: PropTypes.object.isRequired,
    researchActions: PropTypes.object.isRequired,
    researchAPI: PropTypes.object.isRequired,
    researchAPIActions: PropTypes.object.isRequired,
    panelControls: PropTypes.object.isRequired
  };

  state = {
    type: 'Aggregate',
    searchCriteriasName: '',
    selectedKey: '',
    criteriaKeys: [
      'project',
      'model',
      'variable',
      'frequency'
    ]
  };

  constructor (props) {
    super(props);
    this._onAddCriteriaKey = this._onAddCriteriaKey.bind(this);
    this._onLoadSavedCriteria = this._onLoadSavedCriteria.bind(this);
    this._ResetCriterias = this._ResetCriterias.bind(this);
    this._SaveCriterias = this._SaveCriterias.bind(this);
    this._onChangeSearchType = this._onChangeSearchType.bind(this);
    this._onSetSearchCriteriasName = this._onSetSearchCriteriasName.bind(this);
    if(!this.props.sessionManagement.sessionStatus.user.authenticated) {
      NotificationManager.warning(`You need to be authenticated to use search datasets features.`, 'Warning', 10000);
    }
  }

  componentWillMount() {
    if (!this.props.research.pavicsDatasets.items.length && this.props.research.pavicsDatasets.isFetching === false) {
      this.props.researchActions.fetchPavicsDatasetsAndFacets(this.state.type, 0);
    }
    if (this.props.project.currentProject.id) {
      this.props.researchAPIActions.fetchResearchs({ projectId: this.props.project.currentProject.id});
    }
  }

  _onChangeSearchType (value) {
    this.setState({
      type: value
    });
    this.props.researchActions.fetchPavicsDatasetsAndFacets(value);
  }

  _onLoadSavedCriteria (event) {
    const id = event.target.value;
    let searchCriteria = this.props.researchAPI.items.find(x => x.id === id);
    this.setState({
      selectedSavedCriteria: id
    });
    this.props.researchActions.clearFacetKeyValuePairs();
    searchCriteria.facets.forEach((facet) => {
      this.props.researchActions.addFacetKeyValuePair(facet.key, facet.value);
    });
  }

  _onAddCriteriaKey (event) {
    const value = event.target.value;
    let arr = JSON.parse(JSON.stringify(this.state.criteriaKeys));
    arr.push(value);
    this.setState({
      criteriaKeys: arr,
      searchCriteriasName: ''
    });
  }

  _onSetSearchCriteriasName (value) {
    this.setState({
      searchCriteriasName: value
    });
  }

  _ResetCriterias () {
    this.setState({
      type: 'Aggregate',
      criteriaKeys: [
        'project',
        'model',
        'variable',
        'frequency'
      ],
      selectedSavedCriteria: '',
      searchCriteriasName: ''
    });
    this.props.researchActions.clearFacetKeyValuePairs();
    this.props.researchActions.fetchPavicsDatasetsAndFacets();
  }

  _SaveCriterias () {
    if (this.state.searchCriteriasName.length && this.props.research.selectedFacets.length) {
      if (this.props.researchAPI.items.find( x => x.name === this.state.searchCriteriasName)) {
        NotificationManager.warning(`Search criteria(s) already exists with the same name. Please specify another name.`, 'Warning', 10000);
      } else {
        this.props.researchAPIActions.createResearch({
          name: this.state.searchCriteriasName,
          projectId: this.props.project.currentProject.id,
          facets: this.props.research.selectedFacets,
          results: this.props.research.pavicsDatasets.items
        });
      }
    } else {
      NotificationManager.warning("You need to specify a name and at least one criteria to be able to save the current search criteria(s).", 'Warning', 10000);
    }
  }

  render () {
    return (
      <div style={{ margin: 20 }}>
        <div>
          {
            (this.props.research.facets.length === 0) ?
              (<Paper style={{marginTop: 20}}>
                <List>
                  <ListSubheader id="cy-search-no-facets">No facets found.</ListSubheader>
                </List>
              </Paper>)
              : (
              <Paper>
                <div className="container" id="cy-search-facets">
                  <Row>
                    <Col sm={12} md={6} lg={6}>
                      <FormControl style={{width: '95%'}}>
                        <InputLabel htmlFor="saved-criteria">Load criteria(s)</InputLabel>
                        <Select
                          id="cy-load-criterias-sf"
                          value={this.state.selectedSavedCriteria}
                          inputProps={{
                            name: 'saved-criteria',
                            id: 'saved-criteria',
                          }}>
                          onChange={this._onLoadSavedCriteria}>
                          {
                            (this.props.researchAPI.items.length) ?
                            this.props.researchAPI.items.map((search, i) =>
                              <MenuItem key={i} value={search.id}>
                                {search.name}
                              </MenuItem>
                            ): null
                          }
                        </Select>
                      </FormControl>
                    </Col>
                    <Col sm={12} md={6} lg={6}>
                      <FormControl style={{width: '95%'}}>
                        <InputLabel htmlFor="add-criteria">Add additional criteria</InputLabel>
                        <Select
                          id="cy-add-criteria-sf"
                          value={this.state.selectedKey}
                          onChange={this._onAddCriteriaKey}
                          inputProps={{
                            name: 'add-criteria',
                            id: 'add-criteria',
                          }}>
                          {
                            this.props.research.facets.map((x, i) =>
                              !this.state.criteriaKeys.includes(x.key) &&
                               <MenuItem id={`cy-add-criteria-${x.key}`} key={i} value={x.key}>
                                {x.key}
                              </MenuItem>
                            )
                          }
                        </Select>
                      </FormControl>
                    </Col>
                  </Row>
                  <Row style={{marginBottom: 15}}>
                    {
                      this.state.criteriaKeys.map((facetKey, i) => {
                        return <CriteriaSelection
                          fetchDatasets={() => this.props.researchActions.fetchPavicsDatasetsAndFacets(this.state.type)}
                          key={i}
                          criteriaName={facetKey}
                          variables={this.props.research.facets.find(x => x.key === facetKey)}
                          research={this.props.research}
                          researchActions={this.props.researchActions}/>;
                      })
                    }
                  </Row>
                  <Col>
                    <TextField
                      id="cy-criterias-name-tf"
                      helperText="Define a name"
                      fullWidth={true}
                      onChange={(event, value) => this._onSetSearchCriteriasName(value)}
                      label="Search Criteria(s) Name"/>
                  </Col>
                </div>
              </Paper>)
          }
          <Button variant="contained"
            id="cy-save-criterias-btn"
            onClick={this._SaveCriterias}
            label="Save search criteria(s)"
            icon={<SaveIcon />}
            disabled={!this.props.research.selectedFacets.length}
            style={{marginTop: 20}}/>
          <Button variant="contained"
            id="cy-reset-criterias-btn"
            onClick={this._ResetCriterias}
            label="Reset"
            icon={<RefreshIcon />}
            disabled={!this.props.research.selectedFacets.length}
            style={{marginTop: 20, marginLeft: 20}}/>
          {/*<SearchCatalogResults
            clickTogglePanel={this.props.clickTogglePanel}
            research={this.props.research}
            project={this.props.project}
            projectAPIActions={this.props.projectAPIActions}/>*/}
        </div>
      </div>
    );
  }
}
export default SearchCatalog;
