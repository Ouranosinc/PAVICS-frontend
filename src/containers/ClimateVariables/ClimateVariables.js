import React from 'react'
import ClimateVariablesList from '../../components/ClimateVariables'
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
    return (
      <ClimateVariablesList
        onClosePanelCb={this._onClosePanel}
        onOpenPanelCb={this._onOpenPanel}
        show={this.props.panelControls.ClimateVariablesList.show}
      />);
  }
}
export default ClimateVariables
