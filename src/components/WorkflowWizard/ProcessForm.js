import React from 'react';
import {Form, FormGroup, Col, FormControl} from 'react-bootstrap';
import {ExecuteButton} from './../../components/WorkflowWizard';
class ProcessForm extends React.Component {
  static propTypes = {
    selectedProcess: React.PropTypes.object.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    selectedProcessValues: React.PropTypes.object.isRequired,
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    selectedProvider: React.PropTypes.string.isRequired
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
  };

  render () {
    return (
      <Form horizontal>
        {
          this.props.selectedProcessInputs.map((elem, i) => {
            return (
              <FormGroup key={i}>
                <Col sm={2}>{elem.title}</Col>
                <Col sm={10}>
                  <FormControl id={elem.name} type="text" onChange={this.handleChange} />
                  <p>{elem.description}</p>
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
