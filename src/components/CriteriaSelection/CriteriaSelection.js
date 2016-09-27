import React from 'react'
import Table, {TableHeader, SelectableTableRow} from '../../components/Table'
class CriteriaSelection extends React.Component {
  static propTypes = {
    variables: React.PropTypes.array.isRequired,
    selectedFacets: React.PropTypes.array.isRequired,
    addFacetKeyValue: React.PropTypes.func.isRequired,
    removeFacetKeyValue: React.PropTypes.func.isRequired,
    fetchCatalogDatasets: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._onSelectRow = this._onSelectRow.bind(this);
  }

  _onSelectRow(event) {
    if (event.target.checked) {
      this.props.addFacetKeyValue('variable', event.target.value);
    }
    else {
      this.props.removeFacetKeyValue('variable', event.target.value);
    }
    this.props.fetchCatalogDatasets();
  }

  _formatRows() {
    return this.props.variables.map((value) => {
      return [
        value
      ];
    });
  }

  render() {
    let headers = [
      "",
      "Variable name",
    ];
    return (
      <Table rows={this._formatRows()} selectedIndex={-1}>
        <TableHeader fields={headers}/>
        <tbody>
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
    );
  }
}
export default CriteriaSelection
