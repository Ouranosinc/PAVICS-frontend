import React from 'react';
import {FormGroup, Col, FormControl} from 'react-bootstrap';
import classes from '../WorkflowWizard/WorkflowWizard.scss';
import DeformWrapper from '../DeformWrapper/DeformWrapper';
const BOOLEAN = '//www.w3.org/TR/xmlschema-2/#boolean';
const STRING = '//www.w3.org/TR/xmlschema-2/#string';
const NETCDF = 'ComplexData';
const LABEL_NETCDF = 'LABEL_NETCDF';
const LABEL_SHAPEFILE = 'LABEL_SHAPEFILE';
const LABEL_FEATURE_IDS = 'LABEL_FEATURE_IDS';
export default class WpsProcessForm extends React.Component {
  static propTypes = {
    selectedProcess: React.PropTypes.object.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    selectedProcessValues: React.PropTypes.object.isRequired,
    // keep the handleSelected[...] func for now, might use it later
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired
  };


  constructor (props) {
    super(props);
    this.state = {
      formData: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    console.log('form will receive props', nextProps);
    if (nextProps.selectedDatasetLayer['urls']) {
      // TODO when unhardcoding files, remove the [0]
      if (this.state.formData[LABEL_NETCDF] !== nextProps.selectedDatasetLayer['urls'][0]) {
        this.setState({
          ...this.state,
          formData: {
            ...this.state.formData,
            [LABEL_NETCDF]: nextProps.selectedDatasetLayer['urls'][0]
          }
        });
      }
    }
    if (nextProps.selectedShapefile['wmsParams']) {
      if (this.state.formData[LABEL_SHAPEFILE] !== nextProps.selectedShapefile['wmsParams']['LAYERS']) {
        this.setState({
          ...this.state,
          formData: {
            ...this.state.formData,
            [LABEL_SHAPEFILE]: nextProps.selectedShapefile['wmsParams'] ? nextProps.selectedShapefile['wmsParams']['LAYERS'] : ''
          }
        });
      }
    } else {
      this.setState({
        ...this.state,
        formData: {
          ...this.state.formData,
          [LABEL_SHAPEFILE]: ''
        }
      });
    }
    let thisFeatureIdsString = nextProps.selectedRegions.join(', ');
    if (this.state.formData[LABEL_FEATURE_IDS] !== thisFeatureIdsString) {
      this.setState({
        ...this.state,
        formData: {
          ...this.state.formData,
          [LABEL_FEATURE_IDS]: thisFeatureIdsString
        }
      });
    }
  }

  handleChange (event) {
    // TODO eventually this will probably go in the global state
    // so use the handleProcessFormValueChange func passed in props
    let elem = event.target;
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        [elem.id]: elem.value
      }
    });
  }

  makeInput (input) {
    switch (input.dataType) {
      case BOOLEAN:
        return (
          <div>
            <FormControl
              bsClass={classes.checkbox}
              id={input.name}
              type="checkbox"
              name={input.name} />
            <p>{input.description}</p>
          </div>
        );
      case NETCDF:
        return (
          <div>
            <input type="hidden" name="__start__" value="resource:sequence" />
            <FormControl
              name="resource"
              id={LABEL_NETCDF}
              type="text"
              onChange={this.handleChange}
              value={this.state.formData[LABEL_NETCDF]} />
            <input type="hidden" name="__end__" value="resource:sequence" />
            <p>{input.description}</p>
          </div>
        );
      case STRING:
        if (input.name === 'typename') {
          return (
            <div>
              <FormControl
                id={LABEL_SHAPEFILE}
                type="text"
                name={input.name}
                onChange={this.handleChange}
                value={this.state.formData[LABEL_SHAPEFILE]} />
              <p>{input.description}</p>
            </div>
          );
        } else if (input.name === 'featureids') {
          return (
            <div>
              <FormControl
                id={LABEL_FEATURE_IDS}
                type="text"
                name={input.name}
                onChange={this.handleChange}
                value={this.state.formData[LABEL_FEATURE_IDS]} />
              <p>{input.description}</p>
            </div>
          );
        }
        return (
          <div>
            <FormControl
              id={input.name}
              type="text"
              name={input.name}
              value={this.state.formData[input.name]}
              onChange={this.handleChange} />
            <p>{input.description}</p>
          </div>
        );
      default:
        return (
          <div>
            <FormControl
              id={input.name}
              type="text"
              name={input.name}
              value={this.state.formData[input.name]}
              onChange={this.handleChange} />
            <p>{input.description}</p>
          </div>
        );
    }
  }

  render () {
    return (
      <DeformWrapper
        selectedProcessIdentifier={this.props.selectedProcess.identifier}
        selectedProvider={this.props.selectedProvider}>
        {
          this.props.selectedProcessInputs.map((elem, i) => {
            return (
              <Col key={i} sm={12}>
                <FormGroup key={i}>
                  <Col sm={2}>{elem.title}</Col>
                  <Col sm={10}>
                    {this.makeInput(elem)}
                  </Col>
                </FormGroup>
              </Col>
            );
          })
        }
      </DeformWrapper>
    );
  }
}
