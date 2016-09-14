import React from 'react'
import ToggleButton from './ToggleButton'

class TogglingPanel extends React.Component {

  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string.isRequired,
    widgetName: React.PropTypes.string.isRequired,
    classes: React.PropTypes.object.isRequired,
    openedView: React.PropTypes.object.isRequired,
    active: React.PropTypes.bool.isRequired,
  };

  constructor(props)
  {
    super(props);
    this._onOpenPanel = this._onOpenPanel.bind(this);
  }

  _onOpenPanel() {
    this.props.clickTogglePanel(this.props.widgetName, true);
  }

  _closed() {
    return (
        <div className={this.props.classes.overlappingBackground + " " + this.props.classes.togglePanel + " panel panel-default"}>
          <ToggleButton onClick={ this._onOpenPanel } icon={ this.props.icon }/>
        </div>
    );
  }

  render() {
    let content;
    if (this.props.active) {
      content = this.props.openedView;
    }
    else {
      content = this._closed();
    }
    return (
      <div className={ this.props.classes[this.props.widgetName] }>
        <div className={this.props.classes.component}>
          { content }
        </div>
      </div>
    );
  }
}

export default TogglingPanel
