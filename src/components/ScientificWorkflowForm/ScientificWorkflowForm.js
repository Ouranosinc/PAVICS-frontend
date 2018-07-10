import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';
import TextField from'@material-ui/core/TextField';
import Button from'@material-ui/core/Button';
import Paper from'@material-ui/core/Paper';
import Done from '@material-ui/icons/Done';
import WorkflowSchema from './WorkflowSchema';
var Ajv = require('ajv');

export default class ScientificWorkflowForm extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    workflowAPIActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.onWorkflowChanged = this.onWorkflowChanged.bind(this);
    this.tryParseJson = this.tryParseJson.bind(this);
    this.onSaveWorkflow = this.onSaveWorkflow.bind(this);
    this.state = {
      json: '',
      dialogOpened: false
    };
  }

  onWorkflowChanged (e) {
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

  onSaveWorkflow () {
    let parsed = this.tryParseJson();
    if(parsed && this.validateAdvancedWorkflowSchema(parsed)) {
      this.props.workflowAPIActions.createWorkflow({
        projectId: this.props.project.currentProject.id,
        name: parsed.name,
        json: parsed
      });
      this.setState({
        json: ''
      });
    }
  }

  render () {
    return (
      <div id="cy-create-workflow">
        <Paper>
          <div className="container">
            <TextField
              id="cy-create-workflow-json-content-tf"
              value={this.state.json}
              onChange={this.onWorkflowChanged}
              multiline
              rows="1"
              rowsMax="15"
              fullWidth
              helperText="Enter a valid JSON workflow"/>
          </div>
        </Paper>
        <Button
          variant="contained"
          color="primary"
          id="cy-create-workflow-btn"
          onClick={this.onSaveWorkflow}>
          <Done />Create workflow
        </Button>
      </div>
    );
  }
}
