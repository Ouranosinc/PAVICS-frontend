import React from 'react';
import PropTypes from 'prop-types';
import Button from'@material-ui/core/Button';
import Dialog from'@material-ui/core/Dialog';

export class ConfirmDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    affectedResource: PropTypes.object.isRequired,
    onDialogConfirmed: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
    dialogContent: PropTypes.string.isRequired,
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
        <Button variant="contained"
          id="cy-confirm-cancel-btn"
          label="Cancel"
          keyboardFocused={false}
          onTouchTap={() => this.props.onCloseDialog()}
        />,
        <Button variant="contained"
          id="cy-confirm-ok-btn"
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
