import React from 'react'
import {connect} from 'react-redux'
import Panel, {PanelHeader} from '../../components/Panel'
import {ToggleButton} from '../../components/Panel'
import Table from '../../components/Table'
import Loader from '../../components/Loader'
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
        'Variable Name',
      ];
    return (
      this.props.panelControls.ClimateVariablesList.show
        ?
        <Panel>
          <PanelHeader onClick={this._onClosePanel} icon="glyphicon-list">Climate Variables List</PanelHeader>
          {
            this.props.variables.items.length === 0
              ? <Loader name="Climates Variables"/>
              : <Table cellHeaders={headers} rows={this.props.variables.items} selectedIndex={-1}/>
          }
        </Panel>
        : <Panel><ToggleButton onClick={this._onOpenPanel} icon="glyphicon-list"/></Panel>
    );
  }
}
export default ClimateVariables
