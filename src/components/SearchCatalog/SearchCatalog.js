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
    datasetAPI: PropTypes.object.isRequired,
    datasetAPIActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    projectActions: PropTypes.object.isRequired,
    projectAPI: PropTypes.object.isRequired,
    projectAPIActions: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    research: PropTypes.object.isRequired,
    researchActions: PropTypes.object.isRequired,
    researchAPI: PropTypes.object.isRequired,
    researchAPIActions: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired
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
    if(!this.props.session.sessionStatus.user.authenticated) {
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

  onChangeSearchType = (value) => {
    this.setState({
      type: value
    });
    this.props.researchActions.fetchPavicsDatasetsAndFacets(value);
  };

  onLoadSavedCriteria = (id) => {
    let searchCriteria = this.props.researchAPI.items.find(x => x.id === id);
    this.setState({
      selectedSavedCriteria: id
    });
    this.props.researchActions.clearFacetKeyValuePairs();
    searchCriteria.facets.forEach((facet) => {
      this.props.researchActions.addFacetKeyValuePair(facet.key, facet.value);
    });
  };

  onAddCriteriaKey = (event) => {
    const value = event.target.value;
    let arr = JSON.parse(JSON.stringify(this.state.criteriaKeys));
    arr.push(value);
    this.setState({
      criteriaKeys: arr,
      searchCriteriasName: ''
    });
  };

  onSetSearchCriteriasName = (event) => {
    this.setState({
      searchCriteriasName: event.target.value
    });
  };

  onResetCriterias = () => {
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

  onSaveCriterias = () => {
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
                          value={this.state.selectedSavedCriteria}
                          onChange={(event) => this.onLoadSavedCriteria(event.target.value)}
                          inputProps={{
                            id: 'saved-criteria',
                          }}
                          SelectDisplayProps={{
                            id: 'cy-load-criterias-select'
                          }}>
                          {
                            this.props.researchAPI.items.map((search, i) =>
                              <MenuItem key={i} value={search.id}>
                                {search.name}
                              </MenuItem>
                            )
                          }
                        </Select>
                      </FormControl>
                    </Col>
                    <Col sm={12} md={6} lg={6}>
                      <FormControl style={{width: '95%'}}>
                        <InputLabel htmlFor="add-criteria">Add additional criteria</InputLabel>
                        <Select
                          value={this.state.selectedKey}
                          onChange={this.onAddCriteriaKey}
                          inputProps={{
                            id: 'add-criteria'
                          }}
                          SelectDisplayProps={{
                            id: 'cy-add-criteria-select'
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
                      fullWidth
                      onChange={this.onSetSearchCriteriasName}
                      label="Search Criteria(s) Name"/>
                  </Col>

                  <Button variant="contained"
                          id="cy-save-criterias-btn"
                          onClick={this.onSaveCriterias}
                          color="primary"
                          disabled={!this.props.research.selectedFacets.length}
                          style={{marginTop: 20}}>
                    <SaveIcon />Save search criteria(s)
                  </Button>
                  <Button variant="contained"
                          id="cy-reset-criterias-btn"
                          onClick={this.onResetCriterias}
                          color="secondary"
                          disabled={!this.props.research.selectedFacets.length}
                          style={{marginTop: 20, marginLeft: 20}}>
                    <RefreshIcon />Reset
                  </Button>
                </div>
              </Paper>)
          }
          <SearchCatalogResults
            visualizeActions={this.props.visualizeActions}
            datasetAPIActions={this.props.datasetAPIActions}
            research={this.props.research}
            project={this.props.project}
            projectAPIActions={this.props.projectAPIActions}/>
        </div>
      </div>
    );
  }
}
export default SearchCatalog;
