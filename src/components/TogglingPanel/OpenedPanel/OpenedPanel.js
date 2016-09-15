import React from 'react'
import ToggleButton from '../ToggleButton'
import classes from '../TogglingPanel.scss'
class OpenedPanel extends React.Component
{
  static propTypes = {
    onClosePanelCb: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string.isRequired,
    panelTitle: React.PropTypes.string.isRequired,
    panelContentCb: React.PropTypes.func.isRequired,
  };
  render()
  {
    return (
      <div className={classes.overlappingBackground + ' panel panel-default'}>
        <h3><ToggleButton onClick={this.props.onClosePanelCb} icon={this.props.icon}/>{this.props.panelTitle}</h3>
        <div className="panel-body">
          { this.props.panelContentCb() }
        </div>
      </div>
    );
  };
}
export default OpenedPanel
