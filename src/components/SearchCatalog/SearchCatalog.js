import React from 'react';
import Loader from './../../components/Loader';
import { NotificationManager } from 'react-notifications';
import SearchCatalogResults from './../../components/SearchCatalogResults';
import CriteriaSelection from './../../components/CriteriaSelection';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import { Row, Col } from 'react-bootstrap';
import Subheader from 'material-ui/Subheader';
import {List} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import SaveIcon from 'material-ui/svg-icons/content/save';

export class SearchCatalog extends React.Component {
  static propTypes = {
    currentProjectSearchCriterias: React.PropTypes.array.isRequired,
    clickTogglePanel: React.PropTypes.func.isRequired,
    addSearchCriteriasToProject: React.PropTypes.func.isRequired,
    addDatasetsToProject: React.PropTypes.func.isRequired,
    project: React.PropTypes.object.isRequired,
    projectActions: React.PropTypes.object.isRequired,
    projectAPI: React.PropTypes.object.isRequired,
    projectAPIActions: React.PropTypes.object.isRequired,
    research: React.PropTypes.object.isRequired,
    researchActions: React.PropTypes.object.isRequired,
    researchAPI: React.PropTypes.object.isRequired,
    researchAPIActions: React.PropTypes.object.isRequired,
    panelControls: React.PropTypes.object.isRequired
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
  }

  componentWillMount() {
    this.props.researchActions.fetchPavicsDatasets(this.state.type, 0);
    let filter = JSON.stringify({ where: {projectId: this.props.project.currentProject.id}});
    this.props.researchAPIActions.fetchResearchs({ filter: filter });
  }

  _onChangeSearchType (value) {
    this.setState({
      type: value
    });
    this.props.researchActions.fetchPavicsDatasets(value);
  }

  _onLoadSavedCriteria (id) {
    let searchCriteria = this.props.researchAPI.items.find(x => x.id === id);
    this.setState({
      selectedSavedCriteria: id
    });
    this.props.researchActions.clearFacetKeyValuePairs();
    searchCriteria.facets.forEach((facet) => {
      this.props.researchActions.addFacetKeyValuePair(facet.key, facet.value);
    });
  }

  _onAddCriteriaKey (value) {
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
    this.props.researchActions.fetchPavicsDatasets();
  }

  _SaveCriterias () {
    if (this.state.searchCriteriasName.length && this.props.research.selectedFacets.length) {
      if (this.props.researchAPI.items.find( x => x.name === this.state.searchCriteriasName)) {
        NotificationManager.warning(`Search criteria(s) already exists with the same name. Please specify another name.`);
      } else {
        this.props.researchAPIActions.createResearch({
          name: this.state.searchCriteriasName,
          projectId: this.props.project.currentProject.id,
          facets: this.props.research.selectedFacets,
          results: this.props.research.pavicsDatasets.items
        });
        // this.props.researchAPIActions.getResearch({
        //   id: 1,
        //   filter: JSON.stringify({yolo:"yolo"})
        // });
        // this.props.researchAPIActions.updateResearch({
        //   id: 1,
        //   filter: JSON.stringify({yolo:"yolo"})
        // });
        // this.props.researchAPIActions.deleteResearch({
        //   id: 1,
        //   filter: JSON.stringify({yolo:"yolo"})
        // });
        NotificationManager.success("Search criteria(s) was saved with success. Navigate to 'Project Management' section to manage saved search criteria(s).");
      }
    } else {
      NotificationManager.error("You need to specify a name and at least one criteria to be able to save the current search criteria(s).");
    }
  }

  _mainComponent () {
    let mainComponent;
    if (this.props.research.facets.isFetching) {
      mainComponent = <Loader name="facets" />;
    } else {
      mainComponent = (
        (this.props.research.facets.items.length === 0) ?
          <Paper style={{ marginTop: 20 }}>
            <List>
              <Subheader>No facets found.</Subheader>
            </List>
          </Paper>
          : (
          <div>
            <Paper>
              <div className="container">
                <Row>
                  <Col sm={12} md={4} lg={4}>
                    <SelectField
                      style={{width: '95%'}}
                      fullWidth={true}
                      floatingLabelText="Load criteria(s)"
                      value={this.state.selectedSavedCriteria}
                      onChange={(event, index, value) => this._onLoadSavedCriteria(value)}>
                      {
                        this.props.researchAPI.items.map((search, i) => {
                          return <MenuItem key={i} value={search.id} primaryText={search.name} />;
                        })
                      }
                    </SelectField>
                  </Col>
                  <Col sm={12} md={4} lg={4}>
                    <SelectField
                      style={{width: '95%'}}
                      value={this.state.type}
                      floatingLabelText="Type"
                      onChange={(event, index, value) => this._onChangeSearchType(value)}>
                      <MenuItem value="Aggregate" primaryText="Dataset" />
                      <MenuItem value="FileAsAggregate" primaryText="File" />
                    </SelectField>
                  </Col>
                  <Col sm={12} md={4} lg={4}>
                    <SelectField
                      style={{width: '95%'}}
                      floatingLabelText="Add additional criteria"
                      value={this.state.selectedKey}
                      onChange={(event, index, value) => this._onAddCriteriaKey(value)}>
                      {
                        this.props.research.facets.items.map((x, i) => {
                          return (this.state.criteriaKeys.includes(x.key))
                            ? null
                            : <MenuItem key={i} value={x.key} primaryText={x.key} />;
                        })
                      }
                    </SelectField>
                  </Col>
                </Row>
                <Row style={{marginBottom: 15}}>
                  {
                    this.state.criteriaKeys.map((facetKey, i) => {
                      return <CriteriaSelection
                        fetchDatasets={() => this.props.researchActions.fetchPavicsDatasets(this.state.type)}
                        key={i}
                        criteriaName={facetKey}
                        variables={this.props.research.facets.items.find(x => x.key === facetKey)}
                        menuStyle="HERE!!!!"
                        research={this.props.research}
                        researchActions={this.props.researchActions} />;
                    })
                  }
                </Row>
                <Col>
                  <TextField
                    hintText="Define a name"
                    fullWidth={true}
                    onChange={(event, value) => this._onSetSearchCriteriasName(value)}
                    floatingLabelText="Search Criteria(s) Name" />
                </Col>
              </div>
            </Paper>
            <RaisedButton
              onClick={this._SaveCriterias}
              label="Save search criteria(s)"
              icon={<SaveIcon />}
              disabled={!this.props.research.selectedFacets.length}
              style={{marginTop: 20}} />
            <RaisedButton
              onClick={this._ResetCriterias}
              label="Reset"
              icon={<RefreshIcon />}
              disabled={!this.props.research.selectedFacets.length}
              style={{marginTop: 20, marginLeft: 20}} />
            <SearchCatalogResults
              clickTogglePanel={this.props.clickTogglePanel}
              research={this.props.research}
              project={this.props.project}
              projectAPIActions={this.props.projectAPIActions} />
          </div>
        )
      );
    }
    return mainComponent;
  }

  render () {
    return (
      <div style={{ margin: 20 }}>
        {this._mainComponent()}
      </div>
    );
  }
}
export default SearchCatalog;
