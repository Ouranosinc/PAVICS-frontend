import React from 'react';
import {Button} from 'react-bootstrap';
class ExecuteButton extends React.Component {
  static propTypes = {
    executeProcess: React.PropTypes.func.isRequired
  }

  render () {
    console.log('wat');
    return (
      <Button onClick={this.props.executeProcess}>
        executeProcess
      </Button>
    );
  }
}
export default ExecuteButton;
