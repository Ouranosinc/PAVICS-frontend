import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import DeformWrapper from '../DeformWrapper/DeformWrapper';

/*
Wps Process Form
this module builds and updates the values of the inputs of a simple wps process
it uses the custom routes of phoenix "api" to fetch the inputs of a specified provider and process

it seems the dataType property of the inputs might change unpredictably (we have seen three forms to date) but they all seem to end with the type
hence, for string and boolean, implement a type of "endsWith" check instead of pure equivalence

We need to be able to automatically fill some of the fields as well as represent them in a meaningful way
 - for dataType ComplexData and defaultValue.mimeType being application/x-netcdf, fill the field with the url property of the selected dataset
   if there are multiple urls in the selected dataset, we should populate one input for each urls
 - for dataType string and name resource, fill the field with the opendap_url of the selected dataset
 - for dataType string and input.allowedValues.length > 0, make a select with the allowedValues.
   if the maxOccurs is more than one the user might want to choose multiple values, so they should be allowed to
   if maxOccurs is one, then only one value is allowd, so a simple select will be enough
 - for dataType boolean make a checkbox
 - if minOccurs is 0, the input is optional, if it's one, it should be required to submit the form
 - for dataType dateTime create a date picker

the inputs of the selected process are available in props.workflow.selectedProcessInputs

 */

// foreach inputs
//   if minOccurs = 0 mark as optional
//   if maxOccurs > 1 trigger rendering with start end
//   create html input

const BOOLEAN = 'boolean';
const STRING = 'string';
const NETCDF = 'ComplexData';
const LABEL_NETCDF = 'LABEL_NETCDF';
const LABEL_SHAPEFILE = 'LABEL_SHAPEFILE';
const LABEL_FEATURE_IDS = 'LABEL_FEATURE_IDS';
export default class WpsProcessForm extends React.Component {
  static propTypes = {
    executeProcess: React.PropTypes.func.isRequired,
    formId: React.PropTypes.string.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    currentDisplayedDataset: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    workflow: React.PropTypes.object.isRequired,
    workflowActions: React.PropTypes.object.isRequired
  };

  /*
  ATTENTION

  while it does seem like there is data handling and stuff
  it's all lies
  actually, the data is captured in the workflow wizard stepper, with a FormData built directly from a document.querySelector
  likewise, the handleSelectedProcessValueChange was never fully implemented
   */

  constructor (props) {
    super(props);

    // Initially fill formData with input defaultValues if any
    let formData = {};
    this.props.workflow.selectedProcessInputs.forEach((input) => {
      formData[input.name] = input.defaultValue || '';
    });
    this.state = {
      formData: formData
    };
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    console.log('form will receive props', nextProps);
    if (nextProps.currentDisplayedDataset['url']) {
      // TODO when unhardcoding files, remove the [0]
      if (this.state.formData[LABEL_NETCDF] !== nextProps.currentDisplayedDataset['url'][0]) {
        this.setState({
          ...this.state,
          formData: {
            ...this.state.formData,
            [LABEL_NETCDF]: nextProps.currentDisplayedDataset['url'][0]
          }
        });
      }
    }
    if (nextProps.selectedShapefile['wmsParams']) {
      console.log('some things at least still work, next layer written should be %s', nextProps.selectedShapefile['wmsParams']['LAYERS']);
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
      formData: {
        ...this.state.formData,
        [elem.id]: elem.value
      }
    });
  }

  handleCheckBoxChange (event) {
    this.setState({
      formData: {
        ...this.state.formData,
        [event.target.id]: event.target.checked
      }
    });
  }

  makeInputMarkup (input) {

    switch (input.dataType) {
      case BOOLEAN:
        let value = false;
        if (typeof (this.state.formData[input.name]) === 'boolean') {
          value = this.state.formData[input.name];
        } else if (typeof (this.state.formData[input.name]) === 'string') {
          if (this.state.formData[input.name] === 'True') {
            value = true;
          }
        }
        return (
          <div>
            <Checkbox
              id={input.name}
              name={input.name}
              label={input.title}
              labelPosition="right"
              labelStyle={{ textAlign: 'left' }}
              checked={value}
              onCheck={(event, value) => this.handleCheckBoxChange(event)}
              value={value} />
            <small>{input.description}</small>
          </div>
        );
      case NETCDF:
        return (
          <div>
            <TextField
              id={LABEL_NETCDF}
              name="resource"
              fullWidth
              value={this.state.formData[LABEL_NETCDF]}
              onChange={(event, value) => this.handleChange(event)}
              hintText={input.description}
              floatingLabelText={input.title} />
          </div>
        );
      case STRING:
        if (input.name === 'typename') {
          console.log('we have at least one typename');
          return (
            <div>
              <TextField
                id={LABEL_SHAPEFILE}
                name={input.name}
                fullWidth
                value={this.state.formData[LABEL_SHAPEFILE]}
                onChange={(event, value) => this.handleChange(event)}
                hintText={input.description}
                floatingLabelText={input.title} />
            </div>
          );
        } else if (input.name === 'featureids') {
          return (
            <div>
              <TextField
                id={LABEL_FEATURE_IDS}
                name={input.name}
                fullWidth
                value={this.state.formData[LABEL_FEATURE_IDS]}
                onChange={(event, value) => this.handleChange(event)}
                hintText={input.description}
                floatingLabelText={input.title} />
            </div>
          );
        }
        return (
          <div>
            <TextField
              id={input.name}
              name={input.name}
              fullWidth
              value={this.state.formData[input.name]}
              onChange={(event, value) => this.handleChange(event)}
              hintText={input.description}
              floatingLabelText={input.title} />
          </div>
        );
      default:
        return (
          <div>
            <TextField
              id={input.name}
              name={input.name}
              fullWidth
              value={this.state.formData[input.name]}
              onChange={(event, value) => this.handleChange(event)}
              hintText={input.description}
              floatingLabelText={input.title} />
          </div>
        );
    }
  }

  /*
  deform is a library used by phoenix to manage it's different variable forms
  this routine should be creating an html form adapted to the specific ways in which deform creates forms,
  the less intuitive being the interesting __start__ and __end__ inputs around similarly named inputs
  to create a sequence of values. the order is important.
   */
  render () {
    return (
      <DeformWrapper
        formId={this.props.formId}
        execute={this.props.executeProcess}>
        {this.props.workflow.selectedProcessInputs.map((input, i) => {
          console.log('making react component for input %o', input);
          return (
            <div key={i}>
              {input['maxOccurs'] > 1 ? <input type="hidden" name="__start__" value="resource:sequence" /> : ''}
              {this.makeInputMarkup(input)}
              {input['maxOccurs'] > 1 ? <input type="hidden" name="__end__" value="resource:sequence" /> : ''}
            </div>
          );
        })}
      </DeformWrapper>
    );
  }
}
