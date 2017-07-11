import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Done from 'material-ui/svg-icons/action/done';
import WorkflowSchema from './WorkflowSchema';

var Ajv = require('ajv');

const styles = {
  textarea: {
    padding: '20px'
  },
  button: {
    marginTop: '20px'
  }
};

export default class ScientificWorkflowForm extends Component {
  static propTypes = {
    saveWorkflow: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.tryParseJson = this.tryParseJson.bind(this);
    this.handleSaveWorkflow = this.handleSaveWorkflow.bind(this);
    this.state = {
      json: '',
      dialogOpened: false
    };
  }

  handleChange (e) {
    this.setState({
      json: e.target.value
    });
  }

  tryParseJson () {
    try {
      let o = JSON.parse(this.state.json);
      if (o && typeof o === 'object') {
        return o;
      }
    } catch (e) {
      NotificationManager.warning('The value you entered is not valid JSON. You can visit https://jsonlint.com to correct the errors.', 'Warning', 10000);
      return false;
    }

  }

  validateAdvancedWorkflowSchema (object) {
    var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
    var validate = ajv.compile(WorkflowSchema);
    var valid = validate(object);
    if (!valid) {
      let msg = "Your JSON doesn't comply to workflow schema: ";
      let index = 0;
      validate.errors.map((error) => {
        msg = `${msg} ${error.dataPath} ${error.message}${(index+1 === validate.errors.length)?".":", "}`;
        index++;
      });
      console.log(validate.errors);
      NotificationManager.warning(msg, 'Warning', 10000);
      return false
    }
    return true;
  }

  handleSaveWorkflow () {
    let parsed = this.tryParseJson();
    if(parsed && this.validateAdvancedWorkflowSchema(parsed)) {
      this.props.saveWorkflow(parsed);
      NotificationManager.success('Workflow has been created with success', 'Success', 10000);
      this.setState({
        json: ''
      });
    } else {
      // Added JSON Schema and examples
      // this.openDialog();
    }
  }

  render () {
    return (
      <div>
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
      </div>
    );
  }
}
