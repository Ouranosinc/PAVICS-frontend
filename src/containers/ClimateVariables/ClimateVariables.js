import React from 'react'
import Panel, {PanelHeader} from '../../components/Panel'
import {ToggleButton} from '../../components/Panel'
import Table from '../../components/Table'
class ClimateVariables extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._onClosePanel = this._onClosePanel.bind(this);
    this._onOpenPanel = this._onOpenPanel.bind(this);
  }

  _onClosePanel() {
    this.props.clickTogglePanel("ClimateVariablesList", false);
  }

  _onOpenPanel() {
    this.props.clickTogglePanel("ClimateVariablesList", true);
  }

  render() {
    var
      headers = [
        'header1',
        'header2',
      ],
      rows = [
        ['row1value1', 'row1value2'],
        ['row2value1', 'row2value2'],
      ];
    return (
      this.props.panelControls.ClimateVariablesList.show
        ?
        <Panel>
          <PanelHeader onClick={this._onClosePanel} icon="glyphicon-list">Climate Variables List</PanelHeader>
          <Table cellHeaders={headers} rows={rows} selectedIndex={1}/>
        </Panel>
        : <Panel><ToggleButton onClick={this._onOpenPanel} icon="glyphicon-list"/></Panel>
    );
  }
}
export default ClimateVariables
