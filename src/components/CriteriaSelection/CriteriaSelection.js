import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import {List, ListItem} from 'material-ui/List';
import AddFilter from 'material-ui/svg-icons/image/add-to-photos';
import { Col } from 'react-bootstrap';

class CriteriaSelection extends React.Component {
  static propTypes = {
    criteriaName: React.PropTypes.string.isRequired,
    variables: React.PropTypes.object.isRequired,
    research: React.PropTypes.object.isRequired,
    researchActions: React.PropTypes.object.isRequired,
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
    this.props.researchActions.fetchPavicsDatasets();
  }

  _onSelectRow (event) {
    if (event.target.checked) {
      this.props.researchActions.addFacetKeyValuePair(this.props.criteriaName, event.target.value);
    } else {
      this.props.researchActions.removeFacetKeyValuePair(this.props.criteriaName, event.target.value);
    }
    this.props.researchActions.fetchPavicsDatasets();
  }

  _formatRows () {
    let vars = [];
    if (this.state.inputContent.length > 0) {
      vars = this.props.variables.values.filter((value) => {
        return value.toLowerCase().indexOf(this.state.inputContent.toLowerCase()) !== -1;
      });
    } else {
      vars = this.props.variables.values;
    }
    return vars.map((value) => {
      return [
        value
      ];
    });
  }

  _onInputChange (event) {
    var value = event.target.value;
    this.setState({inputContent: value});
  }

  render () {
    return (
      <Col sm={12} md={6} lg={6}>
        <List>
          <ListItem
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
              this._formatRows().map((row, i) => {
                let checked = false;
                this.props.research.selectedFacets.map(x => {
                  if (x.value === row[0]) {
                    checked = true;
                  }
                });
                return (
                  <ListItem
                    key={i}
                    primaryText={row}
                    leftCheckbox={<Checkbox value={row} checked={checked} onCheck={this._onSelectRow} />}
                  />
                );
              })
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
