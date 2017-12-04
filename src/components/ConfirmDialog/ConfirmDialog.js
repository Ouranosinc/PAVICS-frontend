import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

export class ConfirmDialog extends React.Component {
  static propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    affectedResource: React.PropTypes.object.isRequired,
    onDialogConfirmed: React.PropTypes.func.isRequired,
    onCloseDialog: React.PropTypes.func.isRequired,
    dialogContent: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Dialog
      title="Confirmation"
      modal={false}
      open={this.props.isOpen}
      onRequestClose={() => this.props.onCloseDialog()}
      actions={[
        <RaisedButton
          label="Cancel"
          keyboardFocused={false}
          onTouchTap={() => this.props.onCloseDialog()}
        />,
        <RaisedButton
          label="OK"
          primary={true}
          style={{marginLeft: '10px'}}
          keyboardFocused={true}
          onTouchTap={() => {
            this.props.onDialogConfirmed(this.props.affectedResource);
          }}
        />
      ]}>
      {this.props.dialogContent}
    </Dialog>
    );
  }
}

export default ConfirmDialog
