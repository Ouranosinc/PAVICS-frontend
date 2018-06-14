import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from'@material-ui/core/Checkbox';
import Chip from'@material-ui/core/Chip';
import {List, ListItem} from'@material-ui/core/List';
import AddFilter from '@material-ui/icons/AddToPhotos';
import { Col } from 'react-bootstrap';

class CriteriaSelection extends React.Component {
  static propTypes = {
    criteriaName: PropTypes.string.isRequired,
    variables: PropTypes.object.isRequired,
    research: PropTypes.object.isRequired,
    researchActions: PropTypes.object.isRequired,
    fetchDatasets: PropTypes.func.isRequired
  };

  state = {
    open: false
  };

  constructor (props) {
    super(props);
    this._onSelectRow = this._onSelectRow.bind(this);
    this._onInputChange = this._onInputChange.bind(this);
    this.state = {
      inputContent: ''
    };
  }

  _onRemoveFacet (facet) {
    this.props.researchActions.removeFacetKeyValuePair(facet.key, facet.value);
    this.props.fetchDatasets();
  }

  _onSelectRow (event) {
    if (event.target.checked) {
      this.props.researchActions.addFacetKeyValuePair(this.props.criteriaName, event.target.value);
    } else {
      this.props.researchActions.removeFacetKeyValuePair(this.props.criteriaName, event.target.value);
    }
    this.props.fetchDatasets();
  }

  _onInputChange (event) {
    var value = event.target.value;
    this.setState({inputContent: value});
  }

  render () {
    return (
      <Col sm={12} md={6} lg={6}>
        <List id={`cy-search-facet-${this.props.criteriaName.toLowerCase()}-list`}>
          <ListItem
            id={`cy-search-facet-${this.props.criteriaName.toLowerCase()}`}
            nestedListStyle={{
              position: 'absolute', zIndex: '9999', width: '100%', maxHeight: '150px', overflowY: 'scroll', opacity: '1',
              background: 'white', transform: 'scaleY(1)', transformOrigin: 'left top 0px',
              transition: 'transform 500ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 500ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
              boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
              borderRadius: '2px'}}
            primaryText={this.props.criteriaName.toLowerCase().replace(/\b[a-z]/g, function (letter) {
              return letter.toUpperCase();
            })}
            leftIcon={<AddFilter />}
            initiallyOpen={false}
            primaryTogglesNestedList={true}
            nestedItems={
              (this.props.variables &&  this.props.variables.values.length)?
              this.props.variables.values.map((variable, i) => {
                let checked = false;
                const exists = this.props.research.selectedFacets.filter(x => x.value === variable.value);
                if(exists.length) checked = true;
                return <ListItem
                  id={`cy-search-facet-${this.props.criteriaName.toLowerCase()}-${variable.value}`}
                  key={i}
                  primaryText={`${variable.value} (${variable.count})`}
                  leftCheckbox={<Checkbox value={variable.value} checked={checked} onCheck={this._onSelectRow} />}
                />
              }):
              []
            }
          />
        </List>
        <div>
          {
            this.props.research.selectedFacets.map((x, i) =>
              x.key === this.props.criteriaName
                ? <Chip key={i + 1} onRequestDelete={() => this._onRemoveFacet(x)}
                  style={{marginBottom: '5px', width: '100%'}} labelStyle={{width: '95%'}}>
                  {x.value}
                </Chip>
                : null
            )
          }
        </div>
      </Col>
    );
  }
}
export default CriteriaSelection;
