import React from 'react'
import Table, {TableHeader, SelectableTableRow} from '../../components/Table'
import tableClasses from './../../components/Table/Table.scss'
import classes from './CriteriaSelection.scss'
import SearchInput from './SearchInput'
class CriteriaSelection extends React.Component {
  static propTypes = {
    criteriaName: React.PropTypes.string.isRequired,
    variables: React.PropTypes.object.isRequired,
    selectedFacets: React.PropTypes.array.isRequired,
    addFacetKeyValue: React.PropTypes.func.isRequired,
    removeFacetKeyValue: React.PropTypes.func.isRequired,
    fetchCatalogDatasets: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._onSelectRow = this._onSelectRow.bind(this);
    this._onInputChange = this._onInputChange.bind(this);
    this.state = {
      inputContent: ""
    };
  }

  _onSelectRow(event) {
    if (event.target.checked) {
      this.props.addFacetKeyValue(this.props.criteriaName, event.target.value);
    }
    else {
      this.props.removeFacetKeyValue(this.props.criteriaName, event.target.value);
    }
    this.props.fetchCatalogDatasets();
  }

  _formatRows() {
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

  _onInputChange(event) {
    var value = event.target.value;
    this.setState({inputContent: value});
  }

  render() {
    let headers = [
      this.props.criteriaName,
      <SearchInput onChangeCb={this._onInputChange}/>,
    ];
    return (
      <div className={classes['CriteriaSelection']}>
        <Table>
          <TableHeader fields={headers}/>
          <tbody className={tableClasses['overflowable']}>
          {
            this._formatRows().map((row, i) => {
              let checked = false;
              this.props.selectedFacets.map(x => {
                if (x.value === row[0]) {
                  checked = true;
                }
              });
              return (
                <SelectableTableRow
                  key={i}
                  checked={checked}
                  value={row[0]}
                  onChangeCb={this._onSelectRow}
                  fields={row}/>
              );
            })
          }
          </tbody>
        </Table>
      </div>

    );
  }
}
export default CriteriaSelection
