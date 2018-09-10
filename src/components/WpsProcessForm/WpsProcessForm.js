import React from 'react';
import PropTypes from 'prop-types';
import * as constants from './../../constants';
import { WpsProcessFormInput } from '../WpsProcessFormInput';
import DeformWrapper from '../DeformWrapper';

/*
Wps Process Form
this module builds and updates the values of the inputs of a simple wps process
it uses the custom routes of phoenix "api" to fetch the inputs of a specified provider and process

the inputs of the selected process are available in props.workflow.selectedProcessInputs

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

Of interest here, is that we need to keep track of each inputs in the form, and arbitrarily set their values both from user input and map interaction
we use material's usual controlled inputs linked to the state of the component
we have to do this dynamically because we don't know beforehand the actual quantity or names the inputs will have

we have to find a unique identifier for each inputs a form can have,
we should be able to expect that  the combination of datatype and name will be unique, except in the case of deform's sequence
where there can be more than one input with the name "resource" with the type ComplexData
for all intent and purposes however, that should be left for the input renderer to manage
at this level, the form data should be a flat array or dataType.name values
 */

const makeUniqueIdentifier = input => {
  return `${input.dataType}.${input.name}`;
};

export default class WpsProcessForm extends React.Component {
  static propTypes = {
    executeProcess: PropTypes.func.isRequired,
    formId: PropTypes.string.isRequired,
    layerDataset: PropTypes.object.isRequired,
    layerRegion: PropTypes.object.isRequired,
    sectionActions: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired
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
    this.state = {
      formData: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount () {
    this.buildFormData(this.props);
  }

  buildFormData (props) {
    let formData = {};
    props.workflow.selectedProcessInputs.forEach((input) => {
      if (input.selectable) {
        formData[makeUniqueIdentifier(input)] = input.defaultValue ? [input.defaultValue] : [];
      } else {
        formData[makeUniqueIdentifier(input)] = input.defaultValue || '';
      }
    });
    this.setState({
      formData: formData
    }, this.verifyMeaningfulValues(props));
  }

  /*
  we hook reacts built in componentWillReceiveProps to update specific relevant parts if the state when necessary
  since the form data is a map of dataType.name, we can update the state when the defined values change externally
  that is, if the selected dataset changes, and we have an entry for ComplexData.resource, update that input with the value of the change
  likewise, if we have an string.resource and the dataset changes, update the state with the opendap_urls

  these are the external changes that can affect the forms (to date)
   - dataset change
   - shapefile selected
   - region selected

  if dataset change
   if exists ComplexData.resource update state with urls
   if exists string.resource update state with opendap_urls
   TODO if exists string.url update state with catalog_urls
  if shapefile change
   if exists string.typename update state with layer name
  if region selected
   if exists string.featureids update state with currently selected regions ids

   */

  verifyMeaningfulValues (props, oldProps = {}) {
    console.log('verifying meaningful values in %o, current state: %o', props, this.state);

    let changedState = {};
    // For each input, if any has the right mimetype and name, propagate new information
    // If not, fields will be loaded with workflow default values if defined
    for(let inputName in this.state.formData) {
      if (inputName.startsWith(constants.LABEL_NETCDF.split('.')[0]) && inputName.endsWith(constants.LABEL_NETCDF.split('.')[1])) {
        if (props.layerDataset.currentDisplayedDataset['url']) {
          changedState[inputName] = props.layerDataset.currentDisplayedDataset['url'];
        } else {
          // If dataset unselected => reset value, else value might be the workflow default value (so do nothing)
          if (oldProps.currentDisplayedDataset && oldProps.currentDisplayedDataset['url']) {
            changedState[inputName] = '';
          }
        }
      }

      if (inputName.startsWith(constants.LABEL_OPENDAP.split('.')[0]) && inputName.endsWith(constants.LABEL_OPENDAP.split('.')[1])) {
        if (props.layerDataset.currentDisplayedDataset['opendap_url']) {
          changedState[inputName] = props.layerDataset.currentDisplayedDataset['opendap_url'];
        } else {
          // If dataset unselected => reset value, else value might be the workflow default value (so do nothing)
          if (oldProps.visualize && oldProps.layerDataset.currentDisplayedDataset && oldProps.layerDataset.currentDisplayedDataset['opendap_url']) {
            changedState[inputName] = '';
          }
        }
      }

      // TODO Support for thredds catalog url autofill based on dataset selection: string.url update state with catalog_urls
      if (inputName.startsWith(constants.LABEL_SHAPEFILE.split('.')[0]) && inputName.endsWith(constants.LABEL_SHAPEFILE.split('.')[1])) {
        if (props.layerRegion.selectedShapefile['wmsParams'] && props.layerRegion.selectedShapefile['wmsParams']['LAYERS']) {
          changedState[inputName] = props.layerRegion.selectedShapefile['wmsParams']['LAYERS'];
        } else {
          // If shapefile unselected => reset value, else value might be the workflow default value (so do nothing)
          if (oldProps.visualize && oldProps.layerRegion.selectedShapefile && oldProps.layerRegion.selectedShapefile['wmsParams'] &&
            oldProps.layerRegion.selectedShapefile['wmsParams']['LAYERS']) {
            changedState[inputName] = '';
            // FIXME: empty selectedRegions array since value won't fit anymore
          }
        }
      }

      if (inputName.startsWith(constants.LABEL_FEATURE_IDS.split('.')[0]) && inputName.endsWith(constants.LABEL_FEATURE_IDS.split('.')[1])) {
        if (props.layerRegion.selectedRegions && props.layerRegion.selectedRegions.length) {
          changedState[inputName] = props.layerRegion.selectedRegions;
        } else {
          // If region unselected => reset value, else value might be the workflow default value (so do nothing)
          if (oldProps.visualize && oldProps.layerRegion.selectedRegions && oldProps.layerRegion.selectedRegions.length) {
            changedState[inputName] = []
          }
        }
      }
    }

    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        ...changedState
      }
    });
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.workflow.selectedProcessInputs &&
      this.props.workflow.selectedProcessInputs !== nextProps.workflow.selectedProcessInputs) {
      this.buildFormData(nextProps)
    } else {
      this.verifyMeaningfulValues(nextProps, this.props);
    }
  }

  handleChange (value, uniqueIdentifier) {
    // TODO eventually this will probably go in the global state
    this.setState({
      formData: {
        ...this.state.formData,
        [uniqueIdentifier]: value
      }
    });
  }

  handleArrayChange (value, uniqueIdentifier, index) {
    // TODO eventually this will probably go in the global state
    let wholeArray = this.state.formData[uniqueIdentifier];
    wholeArray[index] = value;
    this.setState({
      formData: {
        ...this.state.formData,
        [uniqueIdentifier]: wholeArray
      }
    });
  }

  /*
  deform is a library used by phoenix to manage it's different variable forms
  this routine should be creating an html form adapted to the specific ways in which deform creates forms,
  the less intuitive being the interesting __start__ and __end__ inputs around similarly named inputs
  to create a sequence of values. the order is important.
   */

  // foreach inputs
  //   if minOccurs = 0 mark as optional
  //   if maxOccurs > 1 trigger rendering with start and end inputs
  //   create html
  render () {
    console.log('creating deform wrapper for inputs %o, current state: %o', this.props.workflow.selectedProcessInputs, this.state);
    return (
      <DeformWrapper
        id="cy-process-form"
        formId={this.props.formId}
        execute={this.props.executeProcess}>
        {this.props.workflow.selectedProcessInputs.map((inputDefinition, i) => {
          const uniqueIdentifier = makeUniqueIdentifier(inputDefinition);
          return (
            <div key={i} className="cy-process-form-field">
              <WpsProcessFormInput
                inputDefinition={inputDefinition}
                uniqueIdentifier={uniqueIdentifier}
                value={this.state.formData[uniqueIdentifier]}
                handleArrayChange={this.handleArrayChange}
                handleChange={this.handleChange} />
            </div>
          );
        })}
      </DeformWrapper>
    );
  }
}
