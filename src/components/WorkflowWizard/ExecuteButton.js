import React from 'react';
import PropTypes from 'prop-types';
import Button from'@material-ui/core/Button';
import ExecuteIcon from '@material-ui/icons/Done';

class ExecuteButton extends React.Component {
  static propTypes = {
    executeProcess: PropTypes.func.isRequired
  };

  render () {
    return (
      <Button
        color="primary"
        variant="contained"
        id="cy-execute-process-btn"
        onClick={this.props.executeProcess}>
        <ExecuteIcon />Execute process
      </Button>
    );
  }
}
export default ExecuteButton;
