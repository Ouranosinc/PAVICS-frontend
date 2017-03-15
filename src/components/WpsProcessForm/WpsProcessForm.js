import React from 'react';
import {Form, FormGroup, Col, FormControl} from 'react-bootstrap';
import {ExecuteButton} from './../../components/WorkflowWizard';
import Paper from 'material-ui/Paper';
import classes from '../WorkflowWizard/WorkflowWizard.scss';
const BOOLEAN = '//www.w3.org/TR/xmlschema-2/#boolean';
const STRING = '//www.w3.org/TR/xmlschema-2/#string';
const NETCDF = 'ComplexData';
function getXhr () {
  return new XMLHttpRequest();
}
function makePostRequest (url, data, callable, params) {
  let xhr = getXhr();
  xhr.onload = function () {
    if (callable !== undefined) {
      callable(xhr.responseText, params);
    }
  };
  xhr.open('POST', url);
  xhr.setRequestHeader('accept', 'text/html');
  xhr.send(data);
}
export default class WpsProcessForm extends React.Component {
  static propTypes = {
    selectedProcess: React.PropTypes.object.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    selectedProcessValues: React.PropTypes.object.isRequired,
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired
  };
  handleChange = (event) => {
    let elem = event.target;
    this.props.handleSelectedProcessValueChange(elem.id, elem.value);
  };
  execute = () => {
    // ugly hack to workaround making one extra trip to the backend
    // we already have had to put strange __start__ and __end__ inputs to work nicely with phoenix
    let formData = new FormData(document.querySelector('#process-form'));
    let url = `${__PAVICS_PHOENIX_PATH__}/processes/execute?wps=${this.props.selectedProvider}&process=${this.props.selectedProcess.identifier}`;
    // let url = `/phoenix/execute?wps=${this.props.selectedProvider}&process=${this.props.selectedProcess.identifier}`;
    makePostRequest(url, formData, (res) => {
      console.log(res);
    });
    // this.props.executeProcess(provider, identifier, values);
    // this.props.goToSection(constants.PLATFORM_SECTION_MONITOR);
  };

  makeInput (input) {
    switch (input.dataType) {
      case BOOLEAN:
        return (
          <div>
            <FormControl bsClass={classes.checkbox} id={input.name} type="checkbox" name={input.name}
              onChange={this.handleChange} />
            <p>{input.description}</p>
          </div>
        );
      case NETCDF:
        console.log('file:', this.props.selectedDatasetLayer);
        return (
          <div>
            <input type="hidden" name="__start__" value="resource:sequence" />
            <FormControl
              name="resource"
              id={input.name}
              type="text"
              onChange={this.handleChange}
              value={this.props.selectedDatasetLayer['opendap_urls'] ? this.props.selectedDatasetLayer['opendap_urls'][0] : ''}/>
            <input type="hidden" name="__end__" value="resource:sequence" />
            <p>{input.description}</p>
          </div>
        );
      case STRING:
        if (input.name === 'typename') {
          return (
            <div>
              <FormControl
                id={input.name}
                type="text"
                name={input.name}
                onChange={this.handleChange}
                value={this.props.selectedShapefile['wmsParams'] ? this.props.selectedShapefile['wmsParams']['LAYERS'] : ''} />
              <p>{input.description}</p>
            </div>
          );
        }
        return (
          <div>
            <FormControl id={input.name} type="text" name={input.name} onChange={this.handleChange} />
            <p>{input.description}</p>
          </div>
        );
      default:
        return (
          <div>
            <FormControl id={input.name} type="text" name={input.name} onChange={this.handleChange} />
            <p>{input.description}</p>
          </div>
        );
    }
  }

  // the form needs a submit named input to actually be executed by phoenix
  // so 1990
  render () {
    return (
      <Paper zDepth={2}>
        <Form id="process-form" horizontal>
          {
            this.props.selectedProcessInputs.map((elem, i) => {
              return (
                <FormGroup key={i}>
                  <Col sm={2}>{elem.title}</Col>
                  <Col sm={10}>
                    {this.makeInput(elem)}
                  </Col>
                </FormGroup>
              );
            })
          }
          <FormGroup>
            <Col smOffset={2} sm={10}>
              <ExecuteButton executeProcess={this.execute} />
            </Col>
          </FormGroup>
          <input type="hidden" name="submit" value="submit" />
        </Form>
      </Paper>
    );
  }
}
