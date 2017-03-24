import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ExecuteIcon from 'material-ui/svg-icons/action/done';

class ExecuteButton extends React.Component {
  static propTypes = {
    executeProcess: React.PropTypes.func.isRequired
  }

  render () {
    return (
      <RaisedButton
        onClick={this.props.executeProcess}
        icon={<ExecuteIcon />}
        label="Execute process" />
    );
  }
}
export default ExecuteButton;
