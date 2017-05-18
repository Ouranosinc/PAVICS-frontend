import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Done from 'material-ui/svg-icons/action/done'
const styles = {
  container: {
    margin: '20px'
  },
  textarea: {
    padding: '20px'
  },
  button: {
    marginTop: '20px'
  }
};
export default class AddWorkflowForm extends Component {
  static propTypes = {
    saveWorkflow: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.tryParseJson = this.tryParseJson.bind(this);
    this.handleSaveWorkflow = this.handleSaveWorkflow.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.state = {
      json: '',
      dialogOpened: false
    };
  }

  openDialog () {
    this.setState({
      dialogOpened: true
    });
  }

  closeDialog () {
    this.setState({
      dialogOpened: false
    });
  }

  handleChange (e) {
    this.setState({
      json: e.target.value
    });
  }

  tryParseJson () {
    // TODO maybe validate that it got attributes necessary for its display (eg the name)
    try {
      let o = JSON.parse(this.state.json);
      if (o && typeof o === 'object') {
        return o;
      }
    } catch (e) {
      return false;
    }

  }

  handleSaveWorkflow () {
    let parsed = this.tryParseJson();
    if (parsed) {
      this.props.saveWorkflow(parsed);
      this.setState({
        json: ''
      });
    } else {
      this.openDialog();
    }
  }

  render () {
    return (
      <div style={styles.container}>
        <Paper style={styles.textarea}>
          <TextField
            value={this.state.json}
            onChange={this.handleChange}
            multiLine={true}
            rowsMax={15}
            fullWidth={true}
            hintText="Entrez un workflow en json"/>
        </Paper>
        <RaisedButton
          onClick={this.handleSaveWorkflow}
          style={styles.button}
          label="Save workflow"
          icon={<Done />}/>
        <Dialog
          title="JSON invalide"
          modal={false}
          open={this.state.dialogOpened}
          onRequestClose={this.closeDialog}
          actions={
            [
              <FlatButton
                label="OK"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.closeDialog}
              />
            ]
          }
        >
          Ce JSON n'est pas valide. Veuillez fournir un JSON valide. Vous pouvez consulter <a target="_blank"
                                                                                              href="https://jsonlint.com/">ce
          site</a> pour corriger les erreurs.
        </Dialog>
      </div>
    );
  }
}
