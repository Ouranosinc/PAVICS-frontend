import React from 'react';
import {Form, FormGroup, Col, FormControl} from 'react-bootstrap';
import {ExecuteButton} from './../../components/WorkflowWizard';
import classes from './WorkflowWizard.scss';
import * as constants from './../../constants';
class ProcessForm extends React.Component {
  static propTypes = {
    selectedProcess: React.PropTypes.object.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    selectedProcessValues: React.PropTypes.object.isRequired,
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    goToSection: React.PropTypes.func.isRequired
  };
  handleChange = (event) => {
    let elem = event.target;
    this.props.handleSelectedProcessValueChange(elem.id, elem.value);
  };
  execute = () => {
    let identifier = this.props.selectedProcess.identifier;
    let provider = this.props.selectedProvider;
    let values = this.props.selectedProcessValues;
    this.props.executeProcess(provider, identifier, values);
    this.props.goToSection(constants.PLATFORM_SECTION_MONITOR);
  };

  makeInput (input) {
    switch (input.dataType) {
      case '//www.w3.org/TR/xmlschema-2/#boolean':
        return (
          <div>
            <FormControl bsClass={classes.checkbox} id={input.name} type="checkbox" onChange={this.handleChange} />
            <p>{input.description}</p>
          </div>
        );
      default:
        return (
          <div>
            <FormControl id={input.name} type="text" onChange={this.handleChange} />
            <p>{input.description}</p>
          </div>
        );
    }
  }

  render () {
    return (
      <Form horizontal>
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
      </Form>
    );
  }
}
export default ProcessForm;
