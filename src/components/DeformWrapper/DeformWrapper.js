import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { ExecuteButton } from '../WorkflowWizard';
import Paper from 'material-ui/Paper';
const gridStyle = {
  'height': '450px',
  'overflowY': 'auto',
  'margin': '10px 0',
  'overflowX': 'hidden'
};
export default class DeformWrapper extends Component {
  static propTypes = {
    selectedProvider: React.PropTypes.string.isRequired,
    selectedProcessIdentifier: React.PropTypes.string.isRequired,

  };

  constructor (props) {
    super(props);
    this.execute = this.execute.bind(this);
    this.makePostRequest = this.makePostRequest.bind(this);
  }

  execute () {
    // ugly hack to workaround making one extra trip to the backend
    // we already have had to put strange __start__ and __end__ inputs to work nicely with phoenix
    let formData = new FormData(document.querySelector('#process-form'));
    let url = `${__PAVICS_PHOENIX_PATH__}/processes/execute?wps=${this.props.selectedProvider}&process=${this.props.selectedProcessIdentifier}`;
    // let url = `/phoenix/execute?wps=${this.props.selectedProvider}&process=${this.props.selectedProcess.identifier}`;
    this.makePostRequest(url, formData, (res) => {
      // TODO actually do something once the post have been done
      console.log(res);
    });
    // this.props.executeProcess(provider, identifier, values);
    // this.props.goToSection(constants.PLATFORM_SECTION_MONITOR);
  }

  makePostRequest (url, data, callable, params) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (callable !== undefined) {
        callable(xhr.responseText, params);
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader('accept', 'text/html');
    xhr.send(data);
  }

  // the form needs a submit named input to actually be executed by phoenix
  // so 1990
  render () {
    // TODO validate that async is really something we want each time
    return (
      // this id="process-form" is used when submitting the form.
      // don't change or remove it, or make sure you update it in the execute function as well
      <Form id="process-form" horizontal>
        <Paper zDepth={2} style={gridStyle}>
          <input type="hidden" name="_charset_" value="UTF-8"/>
          <input type="hidden" name="__formid__" value="deform"/>
          <input type="hidden" name="_async_check" value="true"/>
          {this.props.children}
        </Paper>
        <ExecuteButton executeProcess={this.execute}/>
        <input type="hidden" name="submit" value="submit"/>
      </Form>
    );
  }
}
