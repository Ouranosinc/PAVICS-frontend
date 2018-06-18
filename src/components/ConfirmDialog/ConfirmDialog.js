import React from 'react';
import PropTypes from 'prop-types';
import Button from'@material-ui/core/Button';
import Dialog from'@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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
      open={this.props.isOpen}
      onClose={() => this.props.onCloseDialog()}>
        <DialogTitle>
          Confirmation
        </DialogTitle>
        <DialogContent>
          {this.props.dialogContent}
        </DialogContent>
        <DialogActions>
          <Button variant="contained"
                  id="cy-confirm-cancel-btn"
                  label="Cancel"
                  keyboardFocused={false}
                  onClick={() => this.props.onCloseDialog()}/>
          <Button variant="contained"
                  id="cy-confirm-ok-btn"
                  label="OK"
                  primary={true}
                  style={{marginLeft: '10px'}}
                  keyboardFocused={true}
                  onClick={() => {
                    this.props.onDialogConfirmed(this.props.affectedResource);
                  }}/>
        </DialogActions>
    </Dialog>
    );
  }
}

export default ConfirmDialog
