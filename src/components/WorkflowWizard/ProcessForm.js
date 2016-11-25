import React from 'react';
import {Form, FormGroup, Col, FormControl} from 'react-bootstrap';
class ProcessForm extends React.Component {
  static propTypes = {
    inputs: React.PropTypes.array.isRequired
  };

  render () {
    return (
      <Form horizontal>
        {
          this.props.inputs.map((elem, i) => {
            return (
              <FormGroup key={i} controlId={elem.title}>
                <Col sm={2}>{elem.title}</Col>
                <Col sm={10}>
                  <FormControl type="text" placeholder={elem.dataType} />
                </Col>
              </FormGroup>
            );
          })
        }
      </Form>
    );
  }
}
export default ProcessForm;
