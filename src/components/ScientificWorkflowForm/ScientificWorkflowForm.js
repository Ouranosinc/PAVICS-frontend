import React, { Component } from 'react';
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

// Query public file URL ?
const advancedWorkflowSchema = {"$schema":"http://json-schema.org/draft-04/schema#","title":"Workflow","description":"Advanced workflow schema","type":"object","required":["name"],"minProperties":2,"additionalProperties":false,"properties":{"name":{"description":"Workflow name","type":"string"},"tasks":{"description":"Array of workflow task","type":"array","minItems":1,"items":{"$ref":"#/definitions/workflow_task_schema"}},"parallel_groups":{"description":"Array of group of tasks being executed on multiple processes","type":"array","minItems":1,"items":{"$ref":"#/definitions/group_of_task_schema"}}},"definitions":{"workflow_task_schema":{"description":"Describe a WPS process task","type":"object","required":["name","url","identifier"],"additionalProperties":false,"properties":{"name":{"description":"Unique name given to each workflow task","type":"string"},"url":{"description":"Url of the WPS provider","type":"string"},"identifier":{"description":"Identifier of a WPS process","type":"string"},"inputs":{"description":"Dictionary of inputs that must be fed to the WPS process","type":"object","minItems":1,"patternProperties":{".*":{"oneOf":[{"description":"Data that must be fed to this input","type":"string"},{"description":"Array of data that must be fed to this input","type":"array","minItems":1,"items":{"type":"string"}}]}}},"linked_inputs":{"description":"Dictionary of dynamic inputs that must be fed to the WPS process and obtained by the output of other tasks","type":"object","minItems":1,"patternProperties":{".*":{"oneOf":[{"$ref":"#/definitions/input_description_schema"},{"description":"Array of input description that must be fed to this input","type":"array","minItems":1,"items":{"$ref":"#/definitions/input_description_schema"}}]}}},"progress_range":{"description":"Progress range to map the whole progress of this task","type":"array","minItems":2,"maxItems":2,"items":{"type":"number","minimum":0,"maximum":100}}}},"group_of_task_schema":{"type":"object","description":"Describe a group of tasks to be run concurrently","required":["name","max_processes","map","reduce","tasks"],"additionalProperties":false,"properties":{"name":{"description":"Group of task name","type":"string"},"max_processes":{"description":"Number of processes to run concurrently to process the data","type":"number","minimum":1},"map":{"oneOf":[{"$ref":"#/definitions/input_description_schema"},{"description":"Array of data that has to be mapped directly","type":"array","minItems":1,"items":{"type":"string"}}]},"reduce":{"$ref":"#/definitions/input_description_schema"},"tasks":{"description":"Array of workflow task to run concurrently inside the group","type":"array","minItems":1,"items":{"$ref":"#/definitions/workflow_task_schema"}}}},"input_description_schema":{"description":"Description of an input source","type":"object","required":["task"],"additionalProperties":false,"properties":{"task":{"description":"Task name","type":"string"},"output":{"description":"Task output name","type":"string"},"as_reference":{"description":"Specify if the task output should be obtained as a reference or not","type":"boolean"}}}}};

export default class ScientificWorkflowForm extends Component {
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
    try {
      let o = JSON.parse(this.state.json);
      if (o && typeof o === 'object') {
        return o;
      }
    } catch (e) {
      return false;
    }

  }

  validateAdvancedWorkflowSchema (object) {
    var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
    var validate = ajv.compile(WorkflowSchema);
    var valid = validate(object);
    if (!valid) {
      alert(validate.errors[0].message);
      return false
    }
    return true;
  }

  handleSaveWorkflow () {
    let parsed = this.tryParseJson();

    if(parsed && this.validateAdvancedWorkflowSchema(parsed)) {
      this.props.saveWorkflow(parsed);
      this.setState({
        json: ''
      });
    } else {
      // Added JSON Schema and examples
      this.openDialog();
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
        <Dialog
          title="Invalid JSON invalid"
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
          The value you entered is not valid JSON. You can visit <a target="_blank" href="https://jsonlint.com/">this site</a> to correct the errors.
        </Dialog>
      </div>
    );
  }
}
