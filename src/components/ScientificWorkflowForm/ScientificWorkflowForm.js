import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
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
    project: React.PropTypes.object.isRequired,
    workflowAPIActions: React.PropTypes.object.isRequired
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
        <Paper style={styles.textarea}>
          <TextField
            id="cy-create-workflow-json-content-tf"
            value={this.state.json}
            onChange={this.onWorkflowChanged}
            multiLine={true}
            rowsMax={15}
            fullWidth={true}
            hintText="Enter a valid JSON workflow"/>
        </Paper>
        <RaisedButton
          id="cy-create-workflow-btn"
          onClick={this.onSaveWorkflow}
          style={styles.button}
          label="Create workflow"
          icon={<Done />}/>
      </div>
    );
  }
}
