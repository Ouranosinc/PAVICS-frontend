import React from 'react'
import TogglingPanel, {OpenedPanel} from '../TogglingPanel'
import classes from './style.scss'
import Table from '../Table'
class ClimateVariablesList extends React.Component
{
  constructor(props)
  {
    super(props);
    this._onClosePanel = this._onClosePanel.bind(this);
  }

  _onClosePanel()
  {
    return true;
  }

  _makePanelContent()
  {
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
      <Table cellHeaders={headers} rows={rows}/>
    );
  }

  _makeList()
  {
    return (
      <OpenedPanel
        onClosePanelCb={this._onClosePanel}
        icon="glyphicon-list"
        panelTitle="Climate Variables List"
        panelContentCb={this._makePanelContent}/>
    );
  }

  _onOpenPanel()
  {
    return true;
  }

  render()
  {
    return (
      <TogglingPanel
        clickTogglePanel={this._onOpenPanel}
        icon="glyphicon-list"
        widgetName="ClimateVariableList"
        classes={classes}
        openedView={this._makeList()}
        active={true}/>
    );
  }
}
export default ClimateVariablesList
