import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { ExecuteButton } from '../WorkflowWizard';
import {Card, CardHeader, CardText} from 'material-ui/Card';
const gridStyle = {
  'height': '450px',
  'overflowY': 'auto',
  'margin': '10px 0',
  'overflowX': 'hidden'
};
export default class DeformWrapper extends Component {
  static propTypes = {
    formId: React.PropTypes.string.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    selectedProcessIdentifier: React.PropTypes.string.isRequired,
    execute: React.PropTypes.func.isRequired
  };

  // the form needs a submit named input to actually be executed by phoenix
  // so 1990
  render () {
    // TODO validate that async is really something we want each time
    return (
      // this id="FORM_ID" is used when submitting the form.
      // don't change or remove it, or make sure you update it in the execute function as well
      <Form id={this.props.formId} horizontal>
        <Card style={gridStyle}>
          <CardHeader title="Required inputs" />
          <CardText>
            <input type="hidden" name="_charset_" value="UTF-8"/>
            <input type="hidden" name="__formid__" value="deform"/>
            <input type="hidden" name="_async_check" value="true"/>
            {this.props.children}
          </CardText>
        </Card>
        <ExecuteButton executeProcess={this.props.execute}/>
        <input type="hidden" name="submit" value="submit"/>
      </Form>
    );
  }
}
