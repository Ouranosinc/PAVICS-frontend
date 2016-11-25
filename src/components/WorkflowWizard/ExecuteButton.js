import React from 'react';
import {Button} from 'react-bootstrap';
class ExecuteButton extends React.Component {
  static propTypes = {
    executeProcess: React.PropTypes.func.isRequired
  }

  render () {
    return (
      <Button onClick={this.props.executeProcess}>
        Run process
      </Button>
    );
  }
}
export default ExecuteButton;
