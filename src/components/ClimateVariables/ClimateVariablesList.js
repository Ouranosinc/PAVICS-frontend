import React from 'react'
import TogglingPanel, {OpenedPanel} from '../TogglingPanel'
import classes from './style.scss'
import Table from '../Table'
class ClimateVariablesList extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._onClosePanel = this._onClosePanel.bind(this);
    this._onOpenPanel = this._onOpenPanel.bind(this);
    this._makeOpenedPanel = this._makeOpenedPanel.bind(this);
  }

  _onClosePanel() {
    this.props.clickTogglePanel("ClimateVariablesList", false);
  }

  _makePanelContent() {
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
      <Table cellHeaders={headers} rows={rows} selectedIndex={-1}/>
    );
  }

  _makeOpenedPanel() {
    return (
      <OpenedPanel
        onClosePanelCb={this._onClosePanel}
        icon="glyphicon-list"
        panelTitle="Climate Variables List"
        panelContentCb={this._makePanelContent}/>
    );
  }

  _onOpenPanel() {
    this.props.clickTogglePanel("ClimateVariablesList", true);
  }

  render() {
    return (
      <TogglingPanel
        onOpenPanelCb={this._onOpenPanel}
        icon="glyphicon-list"
        widgetName="ClimateVariablesList"
        classes={classes}
        makeOpenedViewCb={this._makeOpenedPanel}
        active={this.props.panelControls.ClimateVariablesList.show}/>
    );
  }
}
export default ClimateVariablesList
