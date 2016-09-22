import React from 'react'
import Panel, {PanelHeader} from '../../components/Panel'
import {ToggleButton} from '../../components/Panel'
import Table, {TableHeader, SelectableTableRow} from '../../components/Table'
import Loader from '../../components/Loader'
class ClimateVariables extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
    addFacetKeyValue: React.PropTypes.func.isRequired,
    removeFacetKeyValue: React.PropTypes.func.isRequired,
    fetchCatalogDatasets: React.PropTypes.func.isRequired,
    selectedFacets: React.PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this._onClosePanel = this._onClosePanel.bind(this);
    this._onOpenPanel = this._onOpenPanel.bind(this);
    this._onSelectRow = this._onSelectRow.bind(this);
  }

  _onClosePanel() {
    this.props.clickTogglePanel("ClimateVariablesList", false);
  }

  _onOpenPanel() {
    this.props.clickTogglePanel("ClimateVariablesList", true);
  }

  _formatRows() {
    return this.props.variables.items.map((value) => {
      return [
        value
      ];
    });
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

  render() {
    console.log(this.props.selectedFacets);
    var
      headers = [
        "",
        "Variable name",
      ];
    return (
      this.props.panelControls.ClimateVariablesList.show
        ?
        <Panel>
          <PanelHeader onClick={this._onClosePanel} icon="glyphicon-list">Climate Variables List</PanelHeader>
          {
            this.props.variables.items.length === 0
              ? <Loader name="Climates Variables"/>
              :
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
          }
        </Panel>
        : <Panel><ToggleButton onClick={this._onOpenPanel} icon="glyphicon-list"/></Panel>
    );
  }
}
export default ClimateVariables
