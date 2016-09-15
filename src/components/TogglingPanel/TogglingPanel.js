import React from 'react'
import ToggleButton from './ToggleButton'

class TogglingPanel extends React.Component {

  static propTypes = {
    onOpenPanelCb: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string.isRequired,
    widgetName: React.PropTypes.string.isRequired,
    classes: React.PropTypes.object.isRequired,
    makeOpenedViewCb: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool.isRequired,
  };

  constructor(props)
  {
    super(props);
  }


  _closed() {
    return (
        <div className={this.props.classes.overlappingBackground + " " + this.props.classes.togglePanel + " panel panel-default"}>
          <ToggleButton onClick={ this.props.onOpenPanelCb } icon={ this.props.icon }/>
        </div>
    );
  }

  render() {
    let content;
    if (this.props.active) {
      content = this.props.makeOpenedViewCb();
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
