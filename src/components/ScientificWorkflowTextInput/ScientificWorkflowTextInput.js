import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';
import TextField from'@material-ui/core/TextField';
import WorkflowSchema from './WorkflowSchema';
var Ajv = require('ajv');

const styles = {
  textarea: {
    padding: '20px'
  }
};

export default class ScientificWorkflowTextInput extends Component {
  static propTypes = {
    workflow: PropTypes.string
  };

  constructor (props) {
    super(props);
    this._onWorkflowChanged = this._onWorkflowChanged.bind(this);
    this.state = {
      json: (props.workflow) ? props.workflow: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.workflow && nextProps.workflow !== this.props.workflow) {
      this.state = {
        json: nextProps.workflow
      };
    }
  }

  _onWorkflowChanged (e) {
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

  render () {
    return (
      <TextField
        id="cy-confirm-edit-workflow-tf"
        value={this.state.json}
        onChange={this._onWorkflowChanged}
        multiline
        rows="5"
        rowsMax="15"
        fullWidth
        helperText="Enter a valid JSON workflow"/>
    );
  }
}
