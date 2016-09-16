import React from 'react'
import TogglingPanel, {OpenedPanel} from '../TogglingPanel'
import classes from './style.scss'
import Table from '../Table'
class ClimateVariablesList extends React.Component {
  static propTypes = {
    onClosePanelCb: React.PropTypes.func.isRequired,
    onOpenPanelCb: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this._makeOpenedPanel = this._makeOpenedPanel.bind(this);
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
      <Table cellHeaders={headers} rows={rows} selectedIndex={1}/>
    );
  }

  _makeOpenedPanel() {
    return (
      <OpenedPanel
        onClosePanelCb={this.props.onClosePanelCb}
        icon="glyphicon-list"
        panelTitle="Climate Variables List"
        panelContentCb={this._makePanelContent}/>
    );
  }

  render() {
    return (
      <TogglingPanel
        onOpenPanelCb={this.props.onOpenPanelCb}
        icon="glyphicon-list"
        widgetName="ClimateVariablesList"
        classes={classes}
        makeOpenedViewCb={this._makeOpenedPanel}
        active={this.props.show}/>
    );
  }
}
export default ClimateVariablesList
