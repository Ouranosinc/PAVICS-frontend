import React from 'react';
import Loader from './../../components/Loader';
import SearchCatalogResults from './../../containers/SearchCatalogResults';
import CriteriaSelection from './../../components/CriteriaSelection';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import { Row, Col } from 'react-bootstrap';
import Subheader from 'material-ui/Subheader';
import {List} from 'material-ui/List';

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
    panelControls: React.PropTypes.object.isRequired
  };

  state = {
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
  }

  _onAddCriteriaKey (value) {
    let arr = JSON.parse(JSON.stringify(this.state.criteriaKeys));
    arr.push(value);
    this.setState({
      criteriaKeys: arr
    });
  }

  _mainComponent () {
    let mainComponent;
    if (this.props.facets.isFetching) {
      mainComponent = <Loader name="facets" />;
    } else {
      mainComponent = (
        this.props.facets.items.length === 0
          ? <Paper style={{ marginTop: 20 }}>
              <List>
                <Subheader>No facets found.</Subheader>
              </List>
            </Paper>
          : (
          <div className="container">
            <Row>
              <Col sm={12} md={6} lg={6} style={{float: 'right'}}>
                <SelectField
                  style={{width: '100%'}}
                  floatingLabelText="Add additional criteria"
                  value={this.state.selectedKey}
                  onChange={(event, index, value) => this._onAddCriteriaKey(value)}>
                  {
                    this.props.facets.items.map((x, i) => {
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
                    key={i}
                    criteriaName={facetKey}
                    variables={this.props.facets.items.find((x) => {
                      return x.key === facetKey;
                    })}
                    selectedFacets={this.props.selectedFacets}
                    addFacetKeyValue={this.props.addFacetKeyValue}
                    removeFacetKeyValue={this.props.removeFacetKeyValue}
                    fetchPavicsDatasets={this.props.fetchPavicsDatasets}
                    fetchEsgfDatasets={this.props.fetchEsgfDatasets} />;
                })
              }
            </Row>
          </div>
        )
      );
    }
    return mainComponent;
  }

  render () {
    return (
      <div style={{ margin: 20 }}>
        <Paper>
          {this._mainComponent()}
        </Paper>
        <SearchCatalogResults {...this.props} />
      </div>
    );
  }
}
export default SearchCatalog;
