import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

export class ConfirmDialog extends React.Component {
  static propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    affectedResource: React.PropTypes.object.isRequired,
    onDialogConfirmed: React.PropTypes.func.isRequired,
    dialogContent: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isOpen != 'undefined') {
      this.setState({
        isOpen: nextProps.isOpen
      })
    }
  }

  closeDialog() {
    this.setState({
      isOpen: false
    });
  }

  render () {
    return (
      <Dialog
        title="Confirmation"
        modal={false}
        open={this.state.isOpen}
        onRequestClose={this.closeDialog.bind(this)}
        actions={[
          <RaisedButton
            label="Cancel"
            keyboardFocused={false}
            onTouchTap={this.closeDialog.bind(this)}
          />,
          <RaisedButton
            label="OK"
            primary={true}
            style={{marginLeft: '10px'}}
            keyboardFocused={true}
            onTouchTap={() => {this.props.onDialogConfirmed(this.props.affectedResource);}}
          />
        ]}>
        {this.props.dialogContent}
      </Dialog>
    )
  }
}

export default ConfirmDialog
